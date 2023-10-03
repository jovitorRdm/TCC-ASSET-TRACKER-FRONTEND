'use client';

import {
  EnvironmentFilled,
  IdcardOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { supplierService } from '@/services/supplier';
import { ErrorMessages } from '@/types/messages';
import { CreateSupplierRequestData, Supplier } from '@/types/supplier';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DatePicker,
  Form,
  Modal,
  Button,
  Steps,
  FormInstance,
  Input,
  Select,
} from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { SupplierPersonalInfoStep } from './components/SupplierPersonalInfoStep';
import { SupplierAddressStep } from './components/SupplierAddressStep';

const StyledModal = styled(Modal)`
  @media (max-width: 600px) {
    max-width: unset;
    width: 100% !important;
    height: 100%;

    .ant-modal-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      border-radius: 0;
      padding: 0;

      & > button {
        top: 24px;
      }

      .ant-modal-title {
        padding: 24px 16px 0;
      }

      .ant-modal-body {
        height: 100%;
        padding: 8px 16px;
        overflow-y: auto;
      }

      .ant-modal-footer {
        padding: 8px 16px 16px;
        margin-top: 0;
      }
    }
  }
`;

interface SupplierPersonalInfoStepProps {
  open: boolean;
  supplierToEdit?: Supplier;
  onClose: () => void;
}

export const SupplierDialogForm: React.FC<SupplierPersonalInfoStepProps> = ({
  open,
  supplierToEdit,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [isFirstStepValid, setIsFirstStepValid] = useState(false);
  const [isSecondStepValid, setIsSecondStepValid] = useState(false);

  const [form] = Form.useForm<Supplier>();

  const { resetFields, setFieldsValue, validateFields, getFieldsValue } = form;

  const createSupplier = useMutation({
    mutationFn: (data: CreateSupplierRequestData) =>
      supplierService.create(data),
    onSuccess: (newItem) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'supplier' &&
            (queryKey[1] as number) === 1 &&
            (queryKey[2] === 'all' || queryKey[2] === 'active') &&
            queryKey[3] === '',
        },
        (data: any) => {
          const newArrayOfData = [newItem, ...data.data];

          if (data.data.length === 10) newArrayOfData.pop();

          return { ...data, data: newArrayOfData };
        }
      );

      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          queryKey[0] === 'supplier' &&
          ((queryKey[1] as number) > 1 ||
            queryKey[2] === 'inactive' ||
            queryKey[3] !== ''),
      });
    },
  });

  const editSupplier = useMutation({
    mutationFn: (data: Supplier) => supplierService.update(data),
    onSuccess: (updatedData) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'supplier' && queryKey[3] === '',
        },
        (data: any) => {
          const itemIndex: number = data.data.findIndex(
            (item: Supplier) => item.id === updatedData.id
          );

          if (itemIndex === -1) {
            return data;
          }

          const newArrayOfData = [...data.data];

          newArrayOfData[itemIndex] = updatedData;

          return { ...data, data: newArrayOfData };
        }
      );

      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          queryKey[0] === 'supplier' && queryKey[3] !== '',
      });
    },
  });

  const handleCancel = () => {
    resetFields();
    setIsFirstStepValid(false);
    setIsSecondStepValid(false);
    setStep(0);
    onClose();
  };

  const handleSubmit = () => {
    validateFields()
      .then(() => {
        const dataToSend = getFieldsValue([
          'id',
          'name',
          'document',
          'birthdate',
          'email',
          'phoneNumber',
          'address',
        ]);

        dataToSend.document = dataToSend.document.replace(/\D/g, '');
        dataToSend.phoneNumber = dataToSend.phoneNumber.replace(/\D/g, '');
        dataToSend.address.cep = dataToSend.address.cep.replace(/\D/g, '');

        if (supplierToEdit) {
          editSupplier
            .mutateAsync({
              ...supplierToEdit,
              ...dataToSend,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        } else {
          createSupplier
            .mutateAsync(dataToSend)
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        Swal.fire('Ops!', ErrorMessages.MSGE01, 'error');
      });
  };

  useEffect(() => {
    if (supplierToEdit) {
      setIsFirstStepValid(true);
      setIsSecondStepValid(true);

      setFieldsValue({
        id: supplierToEdit.id,
        name: supplierToEdit.name,
        document: supplierToEdit.document,
        birthdate: dayjs(supplierToEdit.birthdate) as any,
        email: supplierToEdit.email,
        phoneNumber: supplierToEdit.phoneNumber,
        address: supplierToEdit.address,
      });
    }
  }, [supplierToEdit]);

  return (
    <StyledModal
      centered
      open={open}
      onCancel={handleCancel}
      title={`${supplierToEdit ? 'Editar' : 'Adicionar'} Fornecedores`}
      footer={[
        <Button
          danger
          key="cancel"
          style={{ width: 'calc(50% - 4px)' }}
          onClick={handleCancel}
        >
          Cancelar
        </Button>,
        <Button
          key="submit"
          loading={createSupplier.isLoading || editSupplier.isLoading}
          type="primary"
          disabled={
            (!isFirstStepValid && step === 0) ||
            (!isSecondStepValid && step === 1)
          }
          style={{ width: 'calc(50% - 4px)' }}
          onClick={() => {
            if (step < 1) {
              setStep(step + 1);

              return;
            }

            handleSubmit();
          }}
        >
          {step < 1 ? 'Próximo' : 'Salvar'}
        </Button>,
      ]}
    >
      <Steps
        size="small"
        current={step}
        onChange={(vale) => setStep(vale)}
        style={{ margin: '24px 0 16px' }}
        items={[
          {
            title: 'Dados pessoais',
            disabled: createSupplier.isLoading || editSupplier.isLoading,
            icon: <UserOutlined />,
          },
          {
            title: 'Endereço',
            disabled:
              !isFirstStepValid ||
              createSupplier.isLoading ||
              editSupplier.isLoading,
            icon: <EnvironmentFilled />,
          },
        ]}
      />

      {step === 0 && (
        <SupplierPersonalInfoStep
          form={form}
          onStepValidate={(isValid) => setIsFirstStepValid(isValid)}
          // onStepValidate={(isValid) => setIsFirstStepValid(isValid)}
        />
      )}
      {step === 1 && (
        <SupplierAddressStep
          supplierForm={form}
          onStepValidate={(isValid) => setIsSecondStepValid(isValid)}
        />
      )}
    </StyledModal>
  );
};

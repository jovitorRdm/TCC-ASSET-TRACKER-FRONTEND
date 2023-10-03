'use client';

import {
  EnvironmentFilled,
  IdcardOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Modal, Steps } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { ErrorMessages } from '@/types/messages';
import { CreateCustomerRequestData, Customer } from '@/types/customer';
import { customerService } from '@/services/customer';
import { CustomerPersonalInfoStep } from './components/CustomerPersonaInfoStep';
import { CustomerAddressStep } from './components/CustomerAddressStep';

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

interface CustomerDialogFormProps {
  open: boolean;
  customerToEdit?: Customer;
  onClose: () => void;
}

export const CustomerDialogForm: React.FC<CustomerDialogFormProps> = ({
  open,
  customerToEdit,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [isFirstStepValid, setIsFirstStepValid] = useState(false);
  const [isSecondStepValid, setIsSecondStepValid] = useState(false);

  const [form] = Form.useForm<Customer>();
  const { resetFields, setFieldsValue, validateFields, getFieldsValue } = form;

  const createCustomer = useMutation({
    mutationFn: (data: CreateCustomerRequestData) =>
      customerService.create(data),
    onSuccess: (newItem) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'customer' &&
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
          queryKey[0] === 'customer' &&
          ((queryKey[1] as number) > 1 ||
            queryKey[2] === 'inactive' ||
            queryKey[3] !== ''),
      });
    },
  });

  const editCustomer = useMutation({
    mutationFn: (data: Customer) => customerService.update(data),
    onSuccess: (updatedData) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'customer' && queryKey[3] === '',
        },
        (data: any) => {
          const itemIndex: number = data.data.findIndex(
            (item: Customer) => item.id === updatedData.id
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
          queryKey[0] === 'customer' && queryKey[3] !== '',
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
          'assignmentId',
        ]);

        dataToSend.document = dataToSend.document.replace(/\D/g, '');
        dataToSend.phoneNumber = dataToSend.phoneNumber.replace(/\D/g, '');
        dataToSend.address.cep = dataToSend.address.cep.replace(/\D/g, '');

        if (customerToEdit) {
          editCustomer
            .mutateAsync({
              ...customerToEdit,
              ...dataToSend,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        } else {
          createCustomer
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
    if (customerToEdit) {
      setIsFirstStepValid(true);
      setIsSecondStepValid(true);

      setFieldsValue({
        id: customerToEdit.id,
        name: customerToEdit.name,
        document: customerToEdit.document,
        birthdate: dayjs(customerToEdit.birthdate) as any,
        email: customerToEdit.email,
        phoneNumber: customerToEdit.phoneNumber,
        address: customerToEdit.address,
      });
    }
  }, [customerToEdit]);

  return (
    <StyledModal
      centered
      open={open}
      onCancel={handleCancel}
      title={`${customerToEdit ? 'Editar' : 'Adicionar'} Cliente`}
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
          loading={createCustomer.isLoading || editCustomer.isLoading}
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
            disabled: createCustomer.isLoading || editCustomer.isLoading,
            icon: <UserOutlined />,
          },
          {
            title: 'Endereço',
            disabled:
              !isFirstStepValid ||
              createCustomer.isLoading ||
              editCustomer.isLoading,
            icon: <EnvironmentFilled />,
          },
        ]}
      />

      {step === 0 && (
        <CustomerPersonalInfoStep
          form={form}
          onStepValidate={(isValid) => setIsFirstStepValid(isValid)}
          // onStepValidate={(isValid) => setIsFirstStepValid(isValid)}
        />
      )}

      {step === 1 && (
        <CustomerAddressStep
          customerForm={form}
          onStepValidate={(isValid) => setIsSecondStepValid(isValid)}
        />
      )}
    </StyledModal>
  );
};

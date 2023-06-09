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
import { CreateEmployeeRequestData, Employee } from '@/types/employee';
import { employeeService } from '@/services/employee';
import { ErrorMessages } from '@/types/messages';
import { EmployeeAddressStep } from './components/EmployeeAddressStep';
import { EmployeePersonalInfoStep } from './components/EmployeePersonaInfoStep';
import { EmployeeRolesStep } from './components/EmployeeAssignmentStep';

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

interface EmployeeDialogFormProps {
  open: boolean;
  employeeToEdit?: Employee;
  onClose: () => void;
}

export const EmployeeDialogForm: React.FC<EmployeeDialogFormProps> = ({
  open,
  employeeToEdit,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [isFirstStepValid, setIsFirstStepValid] = useState(false);
  const [isSecondStepValid, setIsSecondStepValid] = useState(false);

  const [form] = Form.useForm<Employee>();

  const { resetFields, setFieldsValue, validateFields, getFieldsValue } = form;

  const createEmployee = useMutation({
    mutationFn: (data: CreateEmployeeRequestData) =>
      employeeService.create(data),
    onSuccess: (newItem) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'employee' &&
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
          queryKey[0] === 'employee' &&
          ((queryKey[1] as number) > 1 ||
            queryKey[2] === 'inactive' ||
            queryKey[3] !== ''),
      });
    },
  });

  const editEmployee = useMutation({
    mutationFn: (data: Employee) => employeeService.update(data),
    onSuccess: (updatedData) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'employee' && queryKey[3] === '',
        },
        (data: any) => {
          const itemIndex: number = data.data.findIndex(
            (item: Employee) => item.id === updatedData.id
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
          queryKey[0] === 'employee' && queryKey[3] !== '',
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
          'cpf',
          'birthdate',
          'email',
          'phoneNumber',
          'address',
          'assignmentId',
        ]);

        dataToSend.cpf = dataToSend.cpf.replace(/\D/g, '');
        dataToSend.phoneNumber = dataToSend.phoneNumber.replace(/\D/g, '');
        dataToSend.address.cep = dataToSend.address.cep.replace(/\D/g, '');

        if (employeeToEdit) {
          editEmployee
            .mutateAsync({
              ...employeeToEdit,
              ...dataToSend,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        } else {
          createEmployee
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
    if (employeeToEdit) {
      setIsFirstStepValid(true);
      setIsSecondStepValid(true);

      setFieldsValue({
        id: employeeToEdit.id,
        name: employeeToEdit.name,
        cpf: employeeToEdit.cpf,
        birthdate: dayjs(employeeToEdit.birthdate) as any,
        email: employeeToEdit.email,
        phoneNumber: employeeToEdit.phoneNumber,
        address: employeeToEdit.address,
        assignmentId: employeeToEdit.assignmentId,
      });
    }
  }, [employeeToEdit]);

  return (
    <StyledModal
      centered
      open={open}
      onCancel={handleCancel}
      title={`${employeeToEdit ? 'Editar' : 'Adicionar'} colaborador`}
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
          loading={createEmployee.isLoading || editEmployee.isLoading}
          type="primary"
          disabled={
            (!isFirstStepValid && step === 0) ||
            (!isSecondStepValid && step === 1)
          }
          style={{ width: 'calc(50% - 4px)' }}
          onClick={() => {
            if (step < 2) {
              setStep(step + 1);

              return;
            }

            handleSubmit();
          }}
        >
          {step < 2 ? 'Próximo' : 'Salvar'}
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
            disabled: createEmployee.isLoading || editEmployee.isLoading,
            icon: <UserOutlined />,
          },
          {
            title: 'Endereço',
            disabled:
              !isFirstStepValid ||
              createEmployee.isLoading ||
              editEmployee.isLoading,
            icon: <EnvironmentFilled />,
          },
          {
            title: 'Atribuições',
            disabled:
              !isFirstStepValid ||
              !isSecondStepValid ||
              createEmployee.isLoading ||
              editEmployee.isLoading,
            icon: <IdcardOutlined />,
          },
        ]}
      />

      {step === 0 && (
        <EmployeePersonalInfoStep
          form={form}
          onStepValidate={(isValid) => setIsFirstStepValid(isValid)}
          // onStepValidate={(isValid) => setIsFirstStepValid(isValid)}
        />
      )}

      {step === 1 && (
        <EmployeeAddressStep
          employeeForm={form}
          onStepValidate={(isValid) => setIsSecondStepValid(isValid)}
        />
      )}
      {step === 2 && (
        <EmployeeRolesStep form={form} disabled={createEmployee.isLoading} />
      )}
    </StyledModal>
  );
};

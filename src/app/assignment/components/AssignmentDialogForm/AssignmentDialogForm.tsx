'use client';
import { getRoleProps } from '@/helpers/getRoleProps';
import { assignmentService } from '@/services/assignment';
import { AccountType } from '@/types/accountType';
import { Assignment, CreateAssignmentRequestData } from '@/types/assignment';
import { ErrorMessages } from '@/types/messages';
import { PaymentMethod } from '@/types/paymentMethod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Radio,
  RadioChangeEvent,
  Switch,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';

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

interface AssignmentDialogFormProps {
  open: boolean;
  assignmentToEdit?: Assignment;
  onClose: () => void;
}

export const AssignmentDialogForm: React.FC<AssignmentDialogFormProps> = ({
  open,
  assignmentToEdit,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const [form] = Form.useForm();
  const [showSelect, setShowSelect] = useState(false);

  const {
    resetFields,
    setFieldsValue,
    setFieldValue,
    validateFields,
    getFieldsValue,
  } = form;

  const createAssignmentType = useMutation({
    mutationFn: (data: CreateAssignmentRequestData) =>
      assignmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['assignments']);
    },
  });

  const editAssignment = useMutation({
    mutationFn: (data: Assignment) => assignmentService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['assignments']);
    },
  });

  const handleCancel = () => {
    if (createAssignmentType.isLoading || createAssignmentType.isLoading) {
      return;
    }

    resetFields();
    onClose();
  };

  const handleSubmit = () => {
    validateFields()
      .then((data) => {
        if (assignmentToEdit) {
          editAssignment
            .mutateAsync({
              ...assignmentToEdit,
              ...data,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        } else {
          createAssignmentType
            .mutateAsync(data)
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
    if (assignmentToEdit) {
      setFieldsValue({
        name: assignmentToEdit.name,
        description: assignmentToEdit.description,
        paymentMethod: assignmentToEdit.paymentMethod,
        paymentValue: assignmentToEdit.paymentValue,
        accountType: assignmentToEdit.accountType,
        accountRequirement: assignmentToEdit.accountRequirement,
      });
      setShowSelect(assignmentToEdit.accountRequirement);
    }
  }, [assignmentToEdit]);

  return (
    <StyledModal
      centered
      open={open}
      onCancel={handleCancel}
      title={`${assignmentToEdit ? 'Editar' : 'Adicionar'} Atribuição`}
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
          loading={createAssignmentType.isLoading || editAssignment.isLoading}
          type="primary"
          style={{ width: 'calc(50% - 4px)' }}
          onClick={handleSubmit}
        >
          Salvar
        </Button>,
      ]}
    >
      <Form
        layout="vertical"
        size="middle"
        disabled={createAssignmentType.isLoading || editAssignment.isLoading}
        form={form}
        initialValues={{
          name: '',
          description: '',
        }}
      >
        <Form.Item
          required
          label="Nome"
          name="name"
          rules={[
            { required: true, message: '' },
            { type: 'string', min: 3, message: ErrorMessages.MSGE08 },
            { type: 'string', max: 120, message: ErrorMessages.MSGE09 },
          ]}
        >
          <Input size="large" placeholder="Dê um nome para a atribuição..." />
        </Form.Item>

        <Form.Item
          required
          label="Descrição"
          name="description"
          rules={[
            { required: true, message: '' },
            { type: 'string', min: 3, message: ErrorMessages.MSGE08 },
          ]}
        >
          <TextArea
            showCount
            size="large"
            maxLength={500}
            placeholder="Escreva o que está atribuição realizará..."
            autoSize={{ minRows: 2, maxRows: 5 }}
          />
        </Form.Item>

        <label>
          <strong style={{ color: 'red' }}>*</strong> Selecione um o método de
          pagamento
        </label>
        <div
          style={{
            paddingTop: '16px',
            display: 'flex',
            gap: '16px',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Form.Item label="" required name={'paymentMethod'}>
            <Select
              placeholder="Selecione uma opção"
              style={{ width: '150px' }}
              onChange={(value) => {
                setFieldValue('paymentMethod', value);
              }}
              options={[
                { value: 'hour', label: 'Hora' },
                { value: 'day', label: 'Dia' },
                { value: 'event', label: 'Evento' },
                { value: 'peopleQuantity', label: 'Por Pessoa' },
              ]}
            />
          </Form.Item>
          <Form.Item
            required
            name="paymentValue"
            style={{ width: '100%' }}
            rules={[
              { required: true, message: '' },
              { type: 'number', min: 1, message: ErrorMessages.MSGE10 },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              addonAfter="R$"
              placeholder="valor pago em Reais"
              step={0.01}
            />
          </Form.Item>
        </div>

        <Form.Item
          required
          label="Se tiver necessidade de conta"
          name="accountRequirement"
        >
          <Switch
            checkedChildren="Sim"
            checked={showSelect}
            unCheckedChildren="Não"
            onChange={(value) => {
              setFieldValue('accountRequirement', value);
              setShowSelect(value);
            }}
          />
        </Form.Item>

        {showSelect ? (
          <Form.Item label="Selecione o tipo de Conta" name={'accountType'}>
            <Select
              placeholder="Selecione uma opção"
              style={{ width: '50%' }}
              onChange={(value) => {
                setFieldValue('AccountType', value);
              }}
              options={[
                {
                  value: AccountType.EVENTADMINISTRATOR,
                  label: 'Administrador de Eventos',
                },
                { value: AccountType.RECEPTIONIST, label: 'Recepcionista' },
              ]}
            />
          </Form.Item>
        ) : (
          <Form.Item label="Selecione o tipo de Conta" name={'accountType'}>
            <Select
              placeholder="Selecione uma opção"
              disabled
              style={{ width: '50%' }}
              onChange={(value) => {
                setFieldValue('AccountType', value);
              }}
              options={[
                {
                  value: AccountType.EVENTADMINISTRATOR,
                  label: 'Administrador de Eventos',
                },
                { value: AccountType.RECEPTIONIST, label: 'Recepcionista' },
              ]}
            />
          </Form.Item>
        )}
      </Form>
    </StyledModal>
  );
};

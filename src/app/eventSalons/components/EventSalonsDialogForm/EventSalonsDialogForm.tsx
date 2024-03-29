'use client';

import { eventSalonsService } from '@/services/eventSalons';
import { CreateEventSalonsRequestData, EventSalons } from '@/types/eventSalons';
import { ErrorMessages } from '@/types/messages';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect } from 'react';
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

interface EventDialogFormProps {
  open: boolean;
  eventSalonsToEdit?: EventSalons;
  onClose: () => void;
}

export const EventSalonsDialogForm: React.FC<EventDialogFormProps> = ({
  open,
  eventSalonsToEdit,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  const { resetFields, setFieldsValue, validateFields, getFieldsValue } = form;

  const createEventType = useMutation({
    mutationFn: (data: CreateEventSalonsRequestData) =>
      eventSalonsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    },
  });

  const editEvent = useMutation({
    mutationFn: (data: EventSalons) => eventSalonsService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    },
  });

  const handleCancel = () => {
    if (createEventType.isLoading || editEvent.isLoading) {
      return;
    }

    resetFields();
    onClose();
  };

  const handleSubmit = () => {
    validateFields()
      .then((data) => {
        if (eventSalonsToEdit) {
          editEvent
            .mutateAsync({
              ...eventSalonsToEdit,
              ...data,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        } else {
          createEventType
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
    if (eventSalonsToEdit) {
      setFieldsValue({
        name: eventSalonsToEdit.name,
        description: eventSalonsToEdit.description,
      });
    }
  }, [eventSalonsToEdit]);

  return (
    <StyledModal
      centered
      open={open}
      onCancel={handleCancel}
      title={`${eventSalonsToEdit ? 'Editar' : 'Adicionar'} evento`}
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
          loading={createEventType.isLoading || editEvent.isLoading}
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
        disabled={createEventType.isLoading || editEvent.isLoading}
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
          <Input size="large" placeholder="Dê um nome para o Local..." />
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
            placeholder="Escreva a descrição do Local aqui..."
            autoSize={{ minRows: 2, maxRows: 5 }}
          />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

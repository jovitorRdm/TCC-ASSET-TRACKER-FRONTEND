'use client';
import { ErrorMessages } from '@/types/messages';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Cascader,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { InputServiceItemRequestData, ServiceItem } from '@/types/serviceItem';
import { servicesItemService } from '@/services/serviceItem';
import { assignmentService } from '@/services/assignment';
import { GenericStatus } from '@/types/genericStatus';

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

interface ServiceDialogFormProps {
  open: boolean;
  serviceItemToEdit?: ServiceItem;
  onClose: () => void;
}

export const ServiceDialogForm: React.FC<ServiceDialogFormProps> = ({
  open,
  serviceItemToEdit,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  const { resetFields, setFieldsValue, validateFields, getFieldsValue } = form;

  const createServiceItemType = useMutation({
    mutationFn: (data: InputServiceItemRequestData) =>
      servicesItemService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['service']);
    },
  });

  const editService = useMutation({
    mutationFn: (data: InputServiceItemRequestData) =>
      servicesItemService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['service']);
    },
  });

  const handleCancel = () => {
    if (createServiceItemType.isLoading || editService.isLoading) {
      return;
    }

    resetFields();
    onClose();
  };

  const [search, setSearch] = useState('');

  const { data } = useQuery(['assignments', 1, 'active', search], {
    queryFn: () =>
      assignmentService.getPaginated({
        filterByStatus: GenericStatus.active,
        query: search,
      }),
  });

  const handleSubmit = () => {
    validateFields()
      .then((data) => {
        if (serviceItemToEdit) {
          editService
            .mutateAsync({
              ...serviceItemToEdit,
              ...data,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        } else {
          createServiceItemType
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
    if (serviceItemToEdit) {
      setFieldsValue({
        name: serviceItemToEdit.name,
        description: serviceItemToEdit.description,
        assignments:
          serviceItemToEdit.assignments.map((assignment) => assignment.id) ||
          [],
      });
    }
  }, [serviceItemToEdit]);

  return (
    <StyledModal
      centered
      open={open}
      onCancel={handleCancel}
      title={`${serviceItemToEdit ? 'Editar' : 'Adicionar'} Serviço`}
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
          loading={createServiceItemType.isLoading || editService.isLoading}
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
        disabled={createServiceItemType.isLoading || editService.isLoading}
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
          <Input size="large" placeholder="Dê um nome para o Serviço..." />
        </Form.Item>
        <Form.Item
          required
          label="Atribuição por Serviço"
          name="assignments"
          rules={[{ required: true, message: '' }]}
        >
          <Select
            showSearch
            mode="multiple"
            size="large"
            optionFilterProp="children"
            placeholder="Selecione uma atribuição..."
            options={data?.data.map((assignments) => ({
              label: assignments.name,
              value: assignments.id,
            }))}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            onChange={(selectedAssignments) =>
              setFieldsValue({ assignments: selectedAssignments })
            }
          >
            {data?.data.map((assignment) => (
              <Select.Option key={assignment.id} value={assignment.id}>
                {assignment.name}
              </Select.Option>
            ))}
          </Select>
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
            placeholder="Escreva a descrição do Serviço aqui..."
            autoSize={{ minRows: 2, maxRows: 5 }}
          />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

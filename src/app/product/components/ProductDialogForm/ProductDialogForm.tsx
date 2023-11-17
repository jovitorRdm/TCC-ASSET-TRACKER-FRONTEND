'use client';
import { productService } from '@/services/product';
import { InputProductRequestData, Product } from '@/types';
import { ErrorMessages } from '@/types/messages';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
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

interface ProductDialogFormProps {
  open: boolean;
  productToEdit?: Product;
  onClose: () => void;
}

export const ProductDialogForm: React.FC<ProductDialogFormProps> = ({
  open,
  productToEdit,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  const { resetFields, setFieldsValue, validateFields, setFieldValue } = form;

  const createProduct = useMutation({
    mutationFn: (data: InputProductRequestData) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['product']);
    },
  });

  const editProduct = useMutation({
    mutationFn: (data: Product) => productService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['product']);
    },
  });

  const handleCancel = () => {
    if (createProduct.isLoading || editProduct.isLoading) {
      return;
    }

    resetFields();
    onClose();
  };

  const handleSubmit = () => {
    validateFields()
      .then((data) => {
        if (productToEdit) {
          editProduct
            .mutateAsync({
              ...productToEdit,
              ...data,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        } else {
          createProduct
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
    if (productToEdit) {
      setFieldsValue({
        name: productToEdit.name,
        description: productToEdit.description,
        measurementUnit: productToEdit.measurementUnit,
        consumptionPerPerson: productToEdit.consumptionPerPerson,
        value: productToEdit.value,
        quantity: productToEdit.quantity,
      });
    }
  }, [productToEdit]);

  return (
    <StyledModal
      centered
      open={open}
      onCancel={handleCancel}
      title={`${productToEdit ? 'Editar' : 'Adicionar'} Tipo de Produto`}
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
          loading={createProduct.isLoading || editProduct.isLoading}
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
        form={form}
        initialValues={{
          name: '',
          description: '',
          measurementUnit: '',
          consumptionPerPerson: 0,
          value: 0,
          quantity: 0,
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
          <Input
            size="large"
            placeholder="Escreva um nome para o tipo de produto..."
          />
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
            placeholder="Escreva uma descrição para o tipo de produto..."
            autoSize={{ minRows: 2, maxRows: 5 }}
          />
        </Form.Item>

        <div
          style={{
            paddingTop: '16px',
            display: 'flex',
            gap: '16px',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Form.Item
            label="Unidade de Medida"
            required
            name={'measurementUnit'}
          >
            <Select
              placeholder="Selecione uma opção"
              style={{ width: '205px' }}
              onChange={(value) => {
                setFieldValue('', value);
              }}
              options={[
                { value: 'unit', label: 'Unidade' },
                { value: 'package', label: 'Pacote' },
                { value: 'kilogram', label: 'KG.' },
                { value: 'liter', label: 'Litro' },
                { value: 'meter', label: 'Metro' },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Serve por Unidade"
            required
            name="consumptionPerPerson"
            style={{ width: '220px' }}
            rules={[
              { required: true, message: '' },
              { type: 'number', min: 1, message: ErrorMessages.MSGE10 },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="valor pago em Reais"
              step={1.0}
            />
          </Form.Item>
        </div>
      </Form>
    </StyledModal>
  );
};

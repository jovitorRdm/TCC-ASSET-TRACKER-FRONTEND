'use client';
import { productService } from '@/services/product';
import { InputProductRequestData, Product } from '@/types';
import { ErrorMessages } from '@/types/messages';
import { ProductType } from '@/types/productType';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, Modal, Select, Radio } from 'antd';
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
  const [productType, setProductType] = useState<ProductType>();
  const [calculatedValue, setCalculatedValue] = useState<number>();

  const [form] = Form.useForm();
  const { Group: RadioGroup } = Radio;

  const { resetFields, setFieldsValue, validateFields, setFieldValue } = form;

  const createProduct = useMutation({
    mutationFn: (data: InputProductRequestData) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['product']);
    },
  });

  const calculateFinalValue = (percentage: number, value: number) => {
    const finalValue = value + (value * percentage) / 100;
    setCalculatedValue(finalValue);
  };

  const handleProductTypeChange = (e: any) => {
    setProductType(e.target.value);
  };

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
        productType: productToEdit.productType,
        numberDay: productToEdit.numberDay,
        percentage: productToEdit.percentage,
        SaleValue: productToEdit.SaleValue,
      });
      setProductType(productToEdit.productType);
      calculateFinalValue(
        productToEdit.percentage as number,
        productToEdit.value
      );
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
              decimalSeparator=","
              step={1.0}
            />
          </Form.Item>
        </div>
        <Form.Item label="Tipo de Produto" required name={'productType'}>
          <RadioGroup
            onChange={handleProductTypeChange}
            value={productType}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
            }}
            options={[
              { value: 'Consumable', label: 'Consumível' },
              { value: 'Rental', label: 'Aluguel' },
            ]}
          />
        </Form.Item>
        {productType === 'Rental' && (
          <div
            style={{
              display: 'flex',
              gap: '16px',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Form.Item
              label="Quantidade de Dias"
              name="numberDay"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira a quantidade de dias.',
                },
              ]}
            >
              <InputNumber
                decimalSeparator=","
                style={{ width: '160px' }}
                min={1}
              />
            </Form.Item>
            <Form.Item
              label="Valor do aluguel"
              name="SaleValue"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira o valor por dia.',
                },
              ]}
            >
              <InputNumber
                prefix="R$"
                decimalSeparator=","
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>
        )}

        {productType === 'Consumable' && (
          <div
            style={{
              display: 'flex',
              gap: '16px',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Form.Item
              label="Porcentagem de Lucro"
              name="percentage"
              style={{ width: '160px' }}
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira a porcentagem.',
                },
              ]}
            >
              <InputNumber
                onChange={(value) => {
                  form.setFieldValue('percentage', value);
                  calculateFinalValue(
                    value as number,
                    form.getFieldValue('value')
                  );
                }}
                decimalSeparator=","
                prefix="%"
              />
            </Form.Item>
            {/* <Form.Item label="Valor do produto" name="value">
              <InputNumber
                decimalSeparator=","
                formatter={(value) => `R$ ${value}`}
                style={{ width: '100px' }}
                min={1}
                disabled
              />
            </Form.Item>
            <Form.Item label="Valor + Lucro">
              <InputNumber
                value={calculatedValue}
                disabled
                style={{ width: '160px' }}
                formatter={(value) => `R$ ${value}`}
              />
            </Form.Item> */}
          </div>
        )}
      </Form>
    </StyledModal>
  );
};

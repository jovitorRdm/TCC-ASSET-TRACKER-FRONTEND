import { fiscalProductService } from '@/services/fiscalProduct';
import { ErrorMessages, GenericStatus, Product } from '@/types';
import {
  FiscalProduct,
  InputFiscalProductRequestData,
} from '@/types/fiscalProduct';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Statistic,
} from 'antd';
import { Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');
import { supplierService } from '@/services/supplier';
import { productService } from '@/services/product';
import { ProductEntries } from '@/types/productEntries';

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

interface FiscalProductDialogFormProps {
  open: boolean;
  fiscalProductToEdit?: FiscalProduct;
  onClose: () => void;
}

export const FiscalProductDialogForm: React.FC<
  FiscalProductDialogFormProps
> = ({ open, fiscalProductToEdit, onClose }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [search, setSearch] = useState('');
  const [totalAmount, setTotalAmount] = useState(
    fiscalProductToEdit?.totalAmount || 0
  );
  const { resetFields, setFieldsValue, validateFields } = form;

  const productEntries: ProductEntries[] =
    Form.useWatch('productEntries', form) ?? [];

  useEffect(() => {
    setTotalAmount(
      productEntries.reduce(
        (prev, curr) => prev + (curr?.quantity || 0) * (curr?.value || 0),
        0
      )
    );
  }, [productEntries]);

  const createFiscalProduct = useMutation({
    mutationFn: (data: InputFiscalProductRequestData) =>
      fiscalProductService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['fiscalProduct']);
    },
  });

  const editFiscalProduct = useMutation({
    mutationFn: (data: InputFiscalProductRequestData) =>
      fiscalProductService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['fiscalProduct']);
    },
  });

  const { data: supplierData } = useQuery(['supplier', 1, 'active', search], {
    queryFn: () =>
      supplierService.getPaginated({
        filterByStatus: GenericStatus.active,
        query: search,
      }),
  });

  const { data: productData } = useQuery(['Product', 1, 'active'], {
    queryFn: () =>
      productService.getPaginated({
        filterByStatus: GenericStatus.active,
        query: search,
      }),
  });
  const handleCancel = () => {
    if (createFiscalProduct.isLoading || editFiscalProduct.isLoading) {
      return;
    }

    resetFields();
    onClose();
  };

  const handleSubmit = () => {
    validateFields()
      .then((data) => {
        if (fiscalProductToEdit) {
          editFiscalProduct
            .mutateAsync({
              ...fiscalProductToEdit,
              ...data,
              productEntries,
              totalAmount,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        } else {
          createFiscalProduct
            .mutateAsync({ ...data, totalAmount })
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
    if (fiscalProductToEdit) {
      setFieldsValue({
        ...fiscalProductToEdit,
        supplierId: fiscalProductToEdit.supplierId,
        invoiceNumber: fiscalProductToEdit.invoiceNumber,
        totalValue: fiscalProductToEdit.totalAmount,
        issueDate: dayjs(fiscalProductToEdit.issueDate),
        productEntries: fiscalProductToEdit.productEntries,
      });
    }
  }, [fiscalProductToEdit, setFieldsValue]);

  return (
    <StyledModal
      centered
      open={open}
      onCancel={handleCancel}
      title={`${fiscalProductToEdit ? 'Editar' : 'Adicionar'} Nota fiscal`}
      width={850}
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
          loading={createFiscalProduct.isLoading || editFiscalProduct.isLoading}
          type="primary"
          style={{ width: 'calc(50% - 4px)' }}
          onClick={handleSubmit}
        >
          Salvar
        </Button>,
      ]}
    >
      <Form
        form={form}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          required
          label="Fornecedor"
          name="supplierId"
          rules={[{ required: true, message: '' }]}
        >
          <Select
            showSearch
            size="large"
            placeholder="Selecione um Fornecedor..."
            onSearch={setSearch}
          >
            {supplierData?.data.map((supplier) => (
              <Select.Option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Row>
          <Col xs={24} sm={6}>
            <Form.Item
              required
              label="Data de Emissão"
              name="issueDate"
              rules={[
                { required: true, message: '' },
                () => ({
                  validator(_, value) {
                    const isValid = dayjs(value).isBefore(new Date());

                    if (isValid) {
                      return Promise.resolve();
                    }
                    return Promise.reject(ErrorMessages.MSGE11);
                  },
                }),
              ]}
            >
              <DatePicker size="large" format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item required label="Total da Nota" name="totalValue">
              <Input
                style={{ width: '120px' }}
                value={totalAmount}
                prefix="R$"
                readOnly
                disabled
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item
              required
              label="NF - e"
              name="invoiceNumber"
              style={{ width: '300px' }}
              rules={[{ required: true, message: '' }]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Form.List name="productEntries">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => {
                  const itemQuantity = form.getFieldValue([
                    'productEntries',
                    name,
                    'quantity',
                  ]);
                  const itemValue = form.getFieldValue([
                    'productEntries',
                    name,
                    'value',
                  ]);
                  const itemTotal = (itemQuantity || 0) * (itemValue || 0);

                  return (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Space
                        style={{
                          width: '100%',
                          justifyContent: 'start',
                        }}
                      >
                        <Form.Item
                          {...restField}
                          label="Produto"
                          name={[name, 'productId']}
                          style={{ width: '350px' }}
                          rules={[
                            {
                              required: true,
                              message: 'Por favor, selecione um produto',
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            size="large"
                            placeholder="Selecione um Produto..."
                            options={productData?.data.map((Product) => ({
                              label: Product.name,
                              value: Product.id,
                            }))}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="Quantidade"
                          name={[name, 'quantity']}
                          rules={[
                            { required: true, message: 'Informe a quantidade' },
                          ]}
                        >
                          <InputNumber
                            decimalSeparator=","
                            placeholder="Quantidade"
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="Valor"
                          name={[name, 'value']}
                          rules={[
                            { required: true, message: 'Informe o valor' },
                          ]}
                        >
                          <InputNumber
                            decimalSeparator=","
                            placeholder="Valor"
                          />
                        </Form.Item>

                        <Form.Item label="sub total" style={{ width: '120px' }}>
                          <InputNumber
                            value={itemTotal}
                            prefix="R$"
                            decimalSeparator=","
                            readOnly
                            disabled
                          />
                        </Form.Item>
                      </Space>

                      <Button
                        danger
                        style={{ marginTop: '29px' }}
                        type="primary"
                        onClick={() => remove(name)}
                      >
                        Remover
                      </Button>
                    </div>
                  );
                })}

                <Button type="dashed" onClick={() => add()} block>
                  Adicionar Produto
                </Button>
              </>
            )}
          </Form.List>
        </Row>
      </Form>
    </StyledModal>
  );
};

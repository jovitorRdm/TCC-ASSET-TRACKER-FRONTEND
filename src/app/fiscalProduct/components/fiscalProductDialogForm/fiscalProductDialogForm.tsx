import { fiscalProductService } from '@/services/fiscalProduct';
import { ErrorMessages, GenericStatus } from '@/types';
import { FiscalProduct } from '@/types/fiscalProduct';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
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
import { log } from 'console';

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
  const { resetFields, setFieldsValue, validateFields, getFieldsValue } = form;

  const createFiscalProduct = useMutation({
    mutationFn: (data: FiscalProduct) => fiscalProductService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['fiscalProduct']);
    },
  });

  const editFiscalProduct = useMutation({
    mutationFn: (data: FiscalProduct) => fiscalProductService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['fiscalProduct']);
    },
  });

  const handleCancel = () => {
    if (createFiscalProduct.isLoading || editFiscalProduct.isLoading) {
      return;
    }

    resetFields();
    onClose();
  };

  const [search, setSearch] = useState('');

  const { data } = useQuery(['supplier', 1, 'active', search], {
    queryFn: () =>
      supplierService.getPaginated({
        filterByStatus: GenericStatus.active,
        query: search,
      }),
  });

  const { data: productData } = useQuery(['products', 1, 'active'], {
    queryFn: () =>
      productService.getPaginated({
        filterByStatus: GenericStatus.active,
        query: search,
      }),
  });

  console.log('product:', productData);
  console.log('Supplier:', data);

  const handleSubmit = () => {
    validateFields()
      .then((data) => {
        if (fiscalProductToEdit) {
          editFiscalProduct
            .mutateAsync({
              ...fiscalProductToEdit,
              ...data,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        } else {
          createFiscalProduct
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
    if (fiscalProductToEdit) {
      setFieldsValue({
        ...fiscalProductToEdit,
        issueDate: dayjs(fiscalProductToEdit.issueDate),
        supplier:
          fiscalProductToEdit.supplier?.name || fiscalProductToEdit.supplier,
        products: fiscalProductToEdit.Product.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          value: product.value,
        })),
      });
    }
  }, [fiscalProductToEdit, setFieldsValue, productData]);

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
          name="supplier"
          rules={[{ required: true, message: '' }]}
        >
          <Select
            showSearch
            size="large"
            placeholder="Selecione um Fornecedor..."
            options={data?.data.map((supplier) => ({
              label: supplier.name,
              value: supplier.id,
            }))}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            onChange={(selectedsupplier) =>
              setFieldsValue({ supplier: selectedsupplier })
            }
          >
            {data?.data.map((assignment) => (
              <Select.Option key={assignment.id} value={assignment.id}>
                {assignment.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Row>
          <Col xs={24} sm={12}>
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
          <Col sm={12}>
            <Form.Item
              required
              label="NF - e"
              name="invoiceNumber"
              rules={[{ required: true, message: '' }]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Form.List name="products">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
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
                        name={[name, 'product']}
                        style={{ width: '450px' }}
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
                          options={productData?.data.map((product) => ({
                            label: product.name,
                            value: product.id,
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
                        <InputNumber placeholder="Quantidade" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label="Valor"
                        name={[name, 'value']}
                        rules={[{ required: true, message: 'Informe o valor' }]}
                      >
                        <InputNumber placeholder="Valor" />
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
                ))}

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

'use client';
import { budgetService } from '@/services/budget';
import { customerService } from '@/services/customer';
import { productService } from '@/services/product';
import { servicesItemService } from '@/services/serviceItem';
import { GenericStatus } from '@/types';
import { Budget, CreateBudgetRequestData, TypeBudget } from '@/types/budget';
import { ErrorMessages } from '@/types/messages';
import { ProductType } from '@/types/productType';
import dayjs from 'dayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
} from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { eventService } from '@/services/event';
import { budgetProducts } from '@/types/budgetProducts';
import { budgetServices } from '@/types/budgetServices';
import Swal from 'sweetalert2';
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

interface BudgetDialogFormProps {
  open: boolean;
  budgetToEdit?: Budget;
  onClose: () => void;
}

export const BudgetDialogForm: React.FC<BudgetDialogFormProps> = ({
  open,
  budgetToEdit,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [search, setSearch] = useState('');
  const [selectedTypeBudget, setSelectedTypeBudget] = useState('rent');
  const [totalAmount, setTotalAmount] = useState(
    budgetToEdit?.totalAmount || 0
  );

  const { resetFields, setFieldsValue, validateFields } = form;

  const budgetProducts: budgetProducts[] =
    Form.useWatch('budgetProducts', form) ?? [];

  const budgetServices: budgetServices[] =
    Form.useWatch('budgetServices', form) ?? [];

  useEffect(() => {
    setTotalAmount(
      budgetProducts.reduce(
        (prev, curr) => prev + (curr?.quantity || 0) * (curr?.unitPrice || 0),
        0
      ) +
        budgetServices.reduce(
          (prev, curr) => prev + (curr?.quantity || 0) * (curr?.unitPrice || 0),
          0
        )
    );
  }, [budgetProducts, budgetServices]);

  const createBudget = useMutation({
    mutationFn: (data: CreateBudgetRequestData) => budgetService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['budget']);
    },
  });

  const editBudget = useMutation({
    mutationFn: (data: CreateBudgetRequestData) => budgetService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['budget']);
    },
  });

  const { data: dataCustomer } = useQuery(['customer', 1, 'active', search], {
    queryFn: () =>
      customerService.getPaginated({
        filterByStatus: GenericStatus.active,
        query: search,
      }),
  });

  const { data: dataEventType } = useQuery(['eventType', 1, 'active', search], {
    queryFn: () =>
      eventService.getPaginated({
        filterByStatus: GenericStatus.active,
        query: search,
      }),
  });

  const { data: dataService } = useQuery(['service', 1, 'active', search], {
    queryFn: () =>
      servicesItemService.getPaginated({
        filterByStatus: GenericStatus.active,
        query: search,
      }),
  });

  const { data: dataProduct } = useQuery(
    ['product', 1, 'Rental', 'active', search],
    {
      queryFn: () =>
        productService.getPaginated({
          filterByStatus: GenericStatus.active,
          filterByType: ProductType.Rental,
          query: search,
        }),
    }
  );

  const { data: dataProductFull } = useQuery(['product', 1, 'active', search], {
    queryFn: () =>
      productService.getPaginated({
        filterByStatus: GenericStatus.active,
        query: search,
      }),
  });

  const handleCancel = () => {
    if (createBudget.isLoading || editBudget.isLoading) {
      return;
    }
    resetFields();
    onClose();
  };

  const handleSubmit = () => {
    validateFields()
      .then((data) => {
        if (budgetToEdit) {
          editBudget
            .mutateAsync({
              ...budgetToEdit,
              ...data,
              budgetProducts,
              budgetServices,
              totalAmount,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {
              () => {};
            });
        } else {
          createBudget
            .mutateAsync({
              ...data,
              budgetProducts,
              budgetServices,
              totalAmount,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {
              () => {};
            });
        }
      })
      .catch(() => {
        Swal.fire('Ops!', ErrorMessages.MSGE01, 'error');
      });
  };

  useEffect(() => {
    if (budgetToEdit) {
      setFieldsValue({
        ...budgetToEdit,
        id: budgetToEdit.id,
        typeBudget: budgetToEdit.typeBudget,
        customerId: budgetToEdit.customerId,
        numberPeople: budgetToEdit.numberPeople,
        pickupDate: dayjs(budgetToEdit.pickupDate),
        returnDate: dayjs(budgetToEdit.returnDate),
        totalAmount: budgetToEdit.totalAmount,
        totalCharged: budgetToEdit.totalCharged,
        discount: budgetToEdit.discount,
        eventTypeId: budgetToEdit.eventTypeId,
        budgetProducts: budgetToEdit.budgetProducts?.map((budgetProduct) => ({
          ...budgetProduct,
          id: budgetProduct.id,
          productId: budgetProduct.productId,
          quantity: budgetProduct.quantity,
          unitPrice: budgetProduct.unitPrice,
        })),
        budgetService: budgetToEdit.budgetServices,
      });

      setSelectedTypeBudget(budgetToEdit.typeBudget);
    }
  }, [budgetToEdit, setFieldsValue]);

  return (
    <StyledModal
      centered
      open={open}
      onCancel={handleCancel}
      title={`${budgetToEdit ? 'Editar' : 'Adicionar'} Orçamento`}
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
          loading={createBudget.isLoading || editBudget.isLoading}
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
        name="create-budget-form"
        size="middle"
        disabled={createBudget.isLoading || editBudget.isLoading}
        form={form}
        onFinish={handleSubmit}
      >
        <Form.Item
          required
          label="Nome do Cliente"
          name="customerId"
          rules={[
            { required: true, message: '' },
            { type: 'string', min: 3, message: ErrorMessages.MSGE08 },
            { type: 'string', max: 120, message: ErrorMessages.MSGE09 },
          ]}
        >
          <Select
            showSearch
            size="large"
            placeholder="Selecione um cliente..."
            onSearch={setSearch}
          >
            {dataCustomer?.data.map((customer) => (
              <Select.Option key={customer.id} value={customer.id}>
                {customer.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Row justify="space-between">
          <Col>
            <Form.Item required label="Tipo de Orçamento" name={'typeBudget'}>
              <Select
                placeholder="Selecione o tipo de orçamento..."
                style={{ width: 260 }}
                onChange={(value) => setSelectedTypeBudget(value)}
                options={[
                  { value: 'event', label: 'Evento' },
                  { value: 'rent', label: 'Aluguel' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item required label="Data/Hora de inicio" name="pickupDate">
              <DatePicker
                format={'DD/MM/YYYY HH:mm'}
                renderExtraFooter={() => 'extra footer'}
                showTime
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item required label="Data/Hora do Fim" name="returnDate">
              <DatePicker
                format={'DD/MM/YYYY HH:mm'}
                renderExtraFooter={() => 'extra footer'}
                showTime
              />
            </Form.Item>
          </Col>
        </Row>

        <>
          {' '}
          <Row>
            <Col span={6}>
              <Form.Item name={'totalAmount'} label="Valor estimado (R$)">
                <InputNumber
                  disabled
                  prefix="R$"
                  placeholder=" 0,00"
                  style={{ width: 175 }}
                  value={totalAmount}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name={'discount'} label="Valor do Desconto (%)">
                <InputNumber
                  prefix="%"
                  placeholder=" 0,00"
                  style={{ width: 120, textAlign: 'right' }}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                required
                name={'totalCharged'}
                label="Valor do Orçamento"
              >
                <InputNumber
                  required
                  placeholder=" 0,00"
                  prefix="R$"
                  style={{ width: 120, textAlign: 'right' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <>
            {selectedTypeBudget === 'event' && (
              <>
                <Row>
                  <Col span={10}>
                    <Form.Item
                      required
                      label={`Tipo de Evento`}
                      name="eventTypeId"
                    >
                      <Select
                        placeholder="Selecione o tipo de evento..."
                        style={{ width: '300px' }}
                        options={dataEventType?.data.map((event) => ({
                          label: `${event.name}`,
                          value: event.id,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      required
                      label={`Qtd estimada de Pessoas`}
                      name="numberPeople"
                    >
                      <InputNumber
                        min={0}
                        placeholder="0"
                        style={{ width: 125 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.List name="budgetServices">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }, index) => {
                        const itemQuantity = form.getFieldValue([
                          'budgetServices',
                          name,
                          'quantity',
                        ]);

                        const itemValue = form.getFieldValue([
                          'budgetServices',
                          name,
                          'unitPrice',
                        ]);

                        const itemTotal =
                          (itemQuantity || 0) * (itemValue || 0);

                        const setValueService = (
                          serviceId: any,
                          index: any
                        ) => {
                          const service = dataService?.data.find(
                            (s) => s.id === serviceId
                          );
                          if (service) {
                            const newBudgetServices = [
                              ...form.getFieldValue('budgetServices'),
                            ];
                            newBudgetServices[index] = {
                              ...newBudgetServices[index],
                              unitPrice: service.saleValue,
                            };
                            form.setFieldsValue({
                              budgetServices: newBudgetServices,
                            });
                          }
                        };

                        return (
                          <div
                            key={key}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              width: '100%',
                              marginTop: '24px',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Space
                              style={{
                                width: '100%',
                                justifyContent: 'start',
                              }}
                            >
                              <>
                                <Form.Item
                                  {...restField}
                                  label="Serviço"
                                  name={[name, 'serviceId']}
                                  style={{ width: '300px' }}
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        'Por favor, selecione um Serviço',
                                    },
                                  ]}
                                >
                                  <Select
                                    showSearch
                                    size="large"
                                    placeholder="Selecione um Serviço..."
                                    options={dataService?.data.map(
                                      (service) => ({
                                        label: `${service.name} ( ${service.Assignment?.peopleServed} pessoas )`,
                                        value: service.id,
                                      })
                                    )}
                                    onChange={(value) =>
                                      setValueService(value, index)
                                    }
                                  />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  label="Quantidade"
                                  name={[name, 'quantity']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Informe a quantidade',
                                    },
                                  ]}
                                >
                                  <InputNumber placeholder="0,00" min={0} />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  label="Valor"
                                  name={[name, 'unitPrice']}
                                >
                                  <InputNumber
                                    disabled
                                    prefix="R$"
                                    decimalSeparator=","
                                    placeholder="0,00"
                                  />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  label="Sub total"
                                  style={{ width: '80px' }}
                                >
                                  <InputNumber
                                    name="unitPrice"
                                    disabled
                                    prefix="R$"
                                    decimalSeparator=","
                                    value={itemTotal}
                                    readOnly
                                    placeholder="0,00"
                                  />
                                </Form.Item>
                                <Button
                                  danger
                                  style={{
                                    marginTop: '8px',
                                    marginLeft: '10px',
                                  }}
                                  type="primary"
                                  onClick={() => remove(name)}
                                >
                                  Remover
                                </Button>
                              </>
                            </Space>
                          </div>
                        );
                      })}
                      <Button
                        type="dashed"
                        style={{ marginTop: '18px' }}
                        onClick={() => add()}
                        block
                      >
                        Adicionar Serviço
                      </Button>
                    </>
                  )}
                </Form.List>
              </>
            )}
            <Form.List name="budgetProducts">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => {
                    const itemQuantity = form.getFieldValue([
                      'budgetProducts',
                      name,
                      'quantity',
                    ]);

                    const itemValue = form.getFieldValue([
                      'budgetProducts',
                      name,
                      'unitPrice',
                    ]);

                    const itemTotal = (itemQuantity || 0) * (itemValue || 0);

                    const setValueProduct = (productId: any, index: any) => {
                      const product = dataProductFull?.data.find(
                        (s) => s.id === productId
                      );
                      if (product) {
                        const newBudgetProducts = [
                          ...form.getFieldValue('budgetProducts'),
                        ];
                        newBudgetProducts[index] = {
                          ...newBudgetProducts[index],
                          unitPrice: product.value,
                        };
                        form.setFieldsValue({
                          budgetProducts: newBudgetProducts,
                        });
                      }
                    };

                    return (
                      <div
                        key={key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          marginTop: '24px',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Space
                          style={{
                            width: '100%',
                            justifyContent: 'start',
                          }}
                        >
                          <>
                            <Form.Item
                              {...restField}
                              label="Produto"
                              name={[name, 'productId']}
                              style={{ width: '300px' }}
                              rules={[
                                {
                                  required: true,
                                  message: 'Por favor, selecione um Produto',
                                },
                              ]}
                            >
                              <Select
                                showSearch
                                size="large"
                                placeholder="Selecione um Produto..."
                                options={
                                  selectedTypeBudget === 'event'
                                    ? dataProductFull?.data.map((product) => ({
                                        label: `${product.name} ( ${product.consumptionPerPerson} pessoas )`,
                                        value: product.id,
                                      }))
                                    : dataProduct?.data.map((product) => ({
                                        label: `${product.name}`,
                                        value: product.id,
                                      }))
                                }
                                onChange={(value) =>
                                  setValueProduct(value, index)
                                }
                              />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              label="Quantidade"
                              name={[name, 'quantity']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Informe a quantidade',
                                },
                              ]}
                            >
                              <InputNumber min={0} />
                            </Form.Item>
                            <Form.Item {...restField} label="Valor">
                              <InputNumber
                                disabled
                                prefix="R$"
                                decimalSeparator=","
                                value={itemValue}
                                placeholder="0,00"
                              />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              label="Sub total"
                              style={{ width: '80px' }}
                            >
                              <InputNumber
                                disabled
                                prefix="R$"
                                decimalSeparator=","
                                value={itemTotal}
                                readOnly
                                placeholder="0,00"
                              />
                            </Form.Item>
                            <Button
                              danger
                              style={{
                                marginTop: '8px',
                                marginLeft: '10px',
                              }}
                              type="primary"
                              onClick={() => remove(name)}
                            >
                              Remover
                            </Button>
                          </>
                        </Space>
                      </div>
                    );
                  })}
                  <Button
                    type="dashed"
                    style={{ marginTop: '18px' }}
                    onClick={() => add()}
                    block
                  >
                    Adicionar Produto
                  </Button>
                </>
              )}
            </Form.List>
          </>
        </>
      </Form>
    </StyledModal>
  );
};

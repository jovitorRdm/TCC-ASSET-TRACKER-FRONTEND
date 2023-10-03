'use client';

import { addressService } from '@/services/address';
import { Address } from '@/types/address';
import { ErrorMessages } from '@/types/messages';
import { Supplier } from '@/types/supplier';
import { useQuery } from '@tanstack/react-query';
import { Checkbox, Form, FormInstance, Input, Select } from 'antd';
import { MaskedInput } from 'antd-mask-input';
import { useState } from 'react';

interface SupplierAddressStepProps {
  supplierForm: FormInstance<Supplier>;
  onStepValidate: (isValid: boolean) => void;
}

export const SupplierAddressStep: React.FC<SupplierAddressStepProps> = ({
  supplierForm,
  onStepValidate,
}) => {
  const [form] = Form.useForm<Address>();

  const {
    getFieldsValue,
    getFieldValue,
    getFieldsError,
    setFieldsValue,
    setFieldValue,
  } = form;

  const [lastCep, setLastCep] = useState(
    supplierForm.getFieldValue('address')?.cep ?? ''
  );
  const [currentSelectedState, setCurrentSelectedState] = useState(
    supplierForm.getFieldValue('address')?.state ?? ''
  );
  const [noNumber, setNoNumber] = useState(
    supplierForm.getFieldValue('address')?.number === 's/n' ?? false
  );

  const { data: states, isLoading: isLoadingStates } = useQuery(
    ['states'],
    addressService.getAllStates,
    {
      staleTime: Infinity,
    }
  );

  const { data: cities, isLoading: isLoadingCities } = useQuery(
    ['cities', currentSelectedState],
    () => addressService.getCitiesByState(currentSelectedState),
    {
      enabled: currentSelectedState !== '',
      staleTime: Infinity,
    }
  );

  return (
    <Form
      layout="vertical"
      size="middle"
      form={form}
      initialValues={supplierForm.getFieldValue('address')}
      onValuesChange={(fields) => {
        if (fields.state && fields.state !== currentSelectedState) {
          setFieldValue('city', undefined);
          setCurrentSelectedState(fields.state);
        }
        if (
          fields.cep &&
          fields.cep.replace(/\D/g, '').length === 8 &&
          fields.cep.replace(/\D/g, '') !== lastCep
        ) {
          addressService
            .getByCep(fields.cep.replace(/\D/g, ''))
            .then((address) => {
              setLastCep(fields.cep.replace(/\D/g, ''));

              if (!address) return;

              setCurrentSelectedState(address.state);

              setFieldsValue({
                city: address.city,
                neighborhood: address.neighborhood,
                state: address.state,
                street: address.street,
              });
            });
        }
      }}
      onBlur={() => {
        const isValid =
          Object.values(
            getFieldsValue([
              'cep',
              'city',
              'state',
              'neighborhood',
              'street',
              'number',
            ])
          ).filter((value) => !value).length === 0 &&
          !getFieldsError([
            'cep',
            'city',
            'state',
            'neighborhood',
            'street',
            'number',
          ]).some((field) => field.errors.length > 0);

        onStepValidate(isValid);
        supplierForm.setFieldValue('address', getFieldsValue());
      }}
    >
      <Form.Item
        required
        label="CEP"
        name="cep"
        rules={[
          { required: true, message: '' },
          {
            pattern: /^\d{5}-\d{3}$/,
            message: ErrorMessages.MSGE06,
          },
        ]}
      >
        <MaskedInput
          mask="00000-000"
          size="large"
          placeholder="Insira aqui seu CEP"
        />
      </Form.Item>

      <div style={{ display: 'flex', alignItems: 'end', gap: 8 }}>
        <Form.Item
          required
          label="Município-UF"
          name="city"
          style={{ flex: 1 }}
          rules={[{ required: true, message: '' }]}
        >
          <Select
            showSearch
            disabled={currentSelectedState === ''}
            size="large"
            placeholder="Município"
            optionFilterProp="children"
            loading={isLoadingCities}
            options={cities?.map((city) => ({
              label: city,
              value: city,
            }))}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <span style={{ marginBottom: 32 }}>-</span>

        <Form.Item
          required
          name="state"
          style={{ width: 85 }}
          rules={[{ required: true, message: '' }]}
        >
          <Select
            showSearch
            size="large"
            placeholder="UF"
            optionFilterProp="children"
            loading={isLoadingStates}
            options={states?.map((state) => ({
              label: state,
              value: state,
            }))}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </div>

      <Form.Item
        required
        label="Bairro"
        name="neighborhood"
        rules={[{ required: true, message: '' }]}
      >
        <Input size="large" placeholder="Centro" />
      </Form.Item>

      <Form.Item
        required
        label="Rua"
        name="street"
        rules={[{ required: true, message: '' }]}
      >
        <Input size="large" placeholder="Nome da rua" />
      </Form.Item>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Form.Item
          required
          label="Número"
          name="number"
          style={{ flex: 1 }}
          rules={[{ required: true, message: '' }]}
        >
          <Input disabled={noNumber} size="large" placeholder="123" />
        </Form.Item>

        <Checkbox
          checked={noNumber}
          onChange={() => {
            if (noNumber) {
              setFieldValue('number', undefined);
              setNoNumber(false);
            } else {
              setNoNumber(true);
              setFieldValue('number', 's/n');
            }
          }}
        >
          Sem número
        </Checkbox>
      </div>
    </Form>
  );
};

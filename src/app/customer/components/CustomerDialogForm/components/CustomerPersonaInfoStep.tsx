import { Customer } from '@/types/customer';
import { ErrorMessages } from '@/types/messages';
import { validateCPF } from '@/types/validateCPF';
import { validateCNPJ } from '@/types/validateCNPJ';
import { DatePicker, Form, FormInstance, Input, Select } from 'antd';
import { MaskedInput } from 'antd-mask-input';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

interface CustomerPersonalInfoStepProps {
  form: FormInstance<Customer>;
  onStepValidate: (isValid: boolean) => void;
}

export const CustomerPersonalInfoStep: React.FC<
  CustomerPersonalInfoStepProps
> = ({ form, onStepValidate }) => {
  const { getFieldsValue, getFieldsError } = form;
  const documentValue = Form.useWatch('document', form);
  const [selectedOption, setSelectedOption] = useState('cpf');

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <Form
      layout="vertical"
      size="middle"
      form={form}
      onBlur={() => {
        onStepValidate(
          Object.values(
            getFieldsValue([
              'name',
              'document',
              'birthdate',
              'phoneNumber',
              'email',
            ])
          ).filter((value) => !value).length === 0 &&
            !getFieldsError([
              'name',
              'document',
              'birthdate',
              'phoneNumber',
              'email',
            ]).some((field) => field.errors.length > 0)
        );
      }}
    >
      <Form.Item
        required
        label="Nome"
        name="name"
        rules={[
          { required: true, message: 'Por favor, responda este campo' },
          { type: 'string', min: 3, message: ErrorMessages.MSGE08 },
          { type: 'string', max: 120, message: ErrorMessages.MSGE09 },
        ]}
      >
        <Input size="large" placeholder="Nome do Cliente" />
      </Form.Item>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'left',
        }}
      >
        <div>
          <label>
            <strong style={{ color: 'red' }}>*</strong> Tipo de Documento
          </label>{' '}
          <Select
            placeholder="Selecione uma opção"
            size="large"
            style={{ width: '200px' }}
            options={[
              { value: 'cpf', label: 'CPF' },
              { value: 'cnpj', label: 'CNPJ' },
            ]}
            onChange={handleSelectChange}
          />
        </div>
        <div>
          <label>
            <strong style={{ color: 'red' }}>*</strong>Documento
          </label>{' '}
          <Form.Item
            required
            name="document"
            style={{ width: '200px' }}
            rules={[
              {
                required: true,
                message: 'Por favor, preencha este campo',
              },
              {
                pattern:
                  documentValue && documentValue?.length > 11
                    ? /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/
                    : /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                message:
                  documentValue && documentValue?.length > 11
                    ? ErrorMessages.MSGE17
                    : documentValue?.length < 11
                    ? ErrorMessages.MSGE12
                    : 'preencha este campo',
              },
              () => ({
                validator(_, value) {
                  const valueToUse = value.replace(/\D/g, '');
                  const isCNPJ = valueToUse.length > 11;

                  if (isCNPJ) {
                    if (
                      validateCNPJ(valueToUse) ||
                      (valueToUse.length > 11 && valueToUse.length < 14)
                    ) {
                      return Promise.resolve();
                    }
                  } else {
                    if (validateCPF(valueToUse) || valueToUse.length < 11) {
                      return Promise.resolve();
                    }
                  }
                  return Promise.reject(
                    isCNPJ ? ErrorMessages.MSGE17 : ErrorMessages.MSGE12
                  );
                },
              }),
            ]}
          >
            <MaskedInput
              name="document"
              mask={
                selectedOption === 'cpf'
                  ? '000.000.000-00'
                  : '00.000.000/0000-00'
              }
              size="large"
              placeholder={
                selectedOption === 'cpf'
                  ? '999.999.999-99'
                  : '99.999.999/9999-99'
              }
            />
          </Form.Item>
        </div>
      </div>
      <Form.Item
        required
        label="Data de nascimento"
        name="birthdate"
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
        <DatePicker
          size="large"
          format="DD/MM/YYYY"
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item required label="Telefone" name="phoneNumber">
        <MaskedInput
          mask="(00) 00000-0000"
          size="large"
          placeholder="(99) 99999-9999"
        />
      </Form.Item>
      <Form.Item required label="E-mail" name="email">
        <Input size="large" placeholder="exemplo@dominio.com" />
      </Form.Item>
    </Form>
  );
};

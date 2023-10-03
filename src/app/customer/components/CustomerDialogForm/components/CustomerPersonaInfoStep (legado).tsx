import { Customer } from '@/types/customer';
import { ErrorMessages } from '@/types/messages';
import { validateCPF } from '@/types/validateCPF';
import { validateCNPJ } from '@/types/validateCNPJ';
import { DatePicker, Form, FormInstance, Input } from 'antd';
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
  const [documentMask, setDocumentMask] = useState('000.000.000-000');

  const handleDocumentChange = (e: any) => {
    const inputValue = e.target.value.replace(/\D/g, '');
    const isCNPJ = inputValue?.length > 11;
    const isCPF = inputValue?.length < 11;
    const newMask = isCNPJ
      ? '00.000.000/0000-00'
      : isCPF
      ? '000.000.000-00'
      : '000.000.000-000';
    setDocumentMask(newMask);
    form.setFieldsValue({ document: inputValue });
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

      <Form.Item
        required
        label="CPF/CNPJ"
        name="document"
        rules={[
          { required: true, message: 'Por favor, preencha este campo' },
          {
            pattern:
              documentValue && documentValue?.length > 11
                ? /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/
                : /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
            message:
              documentValue && documentValue?.length > 11
                ? ErrorMessages.MSGE17
                : ErrorMessages.MSGE12,
          },
          () => ({
            validator(_, value) {
              const isCNPJ = documentValue && documentValue?.length > 11;
              const valueToUse = value.replace(/\D/g, '');
              const isValid = isCNPJ
                ? validateCPF(valueToUse)
                : validateCNPJ(valueToUse);

              if (isCNPJ) {
                if (
                  isValid ||
                  (valueToUse.length > 11 && valueToUse.length < 14)
                ) {
                  return Promise.resolve();
                }
              } else {
                if (isValid || valueToUse.length < 11) {
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
          mask={documentMask}
          size="large"
          placeholder="999.999.999-99 ou 99.999.999/9999-99"
          onChange={handleDocumentChange}
        />
      </Form.Item>

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

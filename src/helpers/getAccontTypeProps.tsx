import { AccountType } from '@/types/accountType';

type PaymentMethodProps = {
  [key in AccountType]: {
    translated: string;
  };
};

export function getAccountTypeProps(role: AccountType) {
  const props: PaymentMethodProps = {
    [AccountType.EVENTADMINISTRATOR]: {
      translated: 'Administrador de Eventos',
    },
    [AccountType.RECEPTIONIST]: {
      translated: 'Recepcionista',
    },
  };

  return props[role];
}

import { PaymentMethod } from '@/types/paymentMethod';

type PaymentMethodProps = {
  [key in PaymentMethod]: {
    translated: string;
    // outras propriedades específicas de cada método de pagamento
  };
};

export function getRoleProps(role: PaymentMethod) {
  const props: PaymentMethodProps = {
    [PaymentMethod.DAY]: {
      translated: 'Diário',
    },
    [PaymentMethod.HOUR]: {
      translated: 'A Hora',
    },
    [PaymentMethod.EVENT]: {
      translated: 'O Evento',
    },
    [PaymentMethod.PEOPLE_QUANTITY]: {
      translated: 'Por Pessoa',
    },
  };

  return props[role];
}

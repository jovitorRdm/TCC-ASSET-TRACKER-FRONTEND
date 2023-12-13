import Api from './api';
import { SuccessMessages } from '@/types/messages';
import { GenericStatus } from '@/types/genericStatus';
import {
  PaginatedDataResponse,
  PaginatedRequestParams,
} from '@/types/paginatedData';
import { Budget, CreateBudgetRequestData, TypeBudget } from '@/types/budget';
import { MeasurementUnit } from '@/types/measurementUnite';
import { ProductType } from '@/types/productType';
import { AccountType, PaymentMethod } from '@/types';

const baseUrl = '/budget';

async function getPaginated(
  params?: PaginatedRequestParams
): Promise<PaginatedDataResponse<Budget>> {
  return Api.get(baseUrl, { params, headers: { authHeader: true } }).then(
    (res) => res.data
  );

  // return {
  //   data: [
  //     {
  //       id: '18b1b29a-2296-4f06-9c16-10bdb6dcdecb',
  //       typeBudget: TypeBudget.event,
  //       customerId: 'cfa0adfa-0a3b-489a-b0ae-90c6b5da338b',
  //       eventTypeId: 'dd63903d-b22b-4f47-ae24-147300b146f6',
  //       EventType: {
  //         id: 'dd63903d-b22b-4f47-ae24-147300b146f6',
  //         name: 'CHURRASCO',
  //         description: 'CHURRASCO EM FAMILIA',
  //         status: GenericStatus.active,
  //       },
  //       numberPeople: 500,
  //       Customer: {
  //         id: 'cfa0adfa-0a3b-489a-b0ae-90c6b5da338b',
  //         status: GenericStatus.active,
  //         name: 'Maria Lidia aguiar',
  //         document: '20825076021',
  //         birthdate: '2023-08-15T03:15:53.881Z',
  //         phoneNumber: '21324685798',
  //         email: 'dev_gustavo@devcia.com',
  //         address: {
  //           cep: '76380305',
  //           city: 'Goiânia',
  //           state: 'GO',
  //           neighborhood: 'Parque Bandeirantes',
  //           street: 'Rua Maria Silva',
  //           number: 's/n',
  //         },
  //       },
  //       pickupDate: new Date('2023-08-15T15:15:53.881Z'),
  //       returnDate: new Date('2023-08-15T03:15:53.881Z'),
  //       totalAmount: 800 + 625,
  //       totalCharged: 1282.5,
  //       discount: 10,
  //       budgetServices: [
  //         {
  //           id: 0,
  //           serviceId: '8a5c46c9-fbfe-4194-bfc9-30cf766230f6',
  //           budgetId: '18b1b29a-2296-4f06-9c16-10bdb6dcdecb',
  //           quantity: 4,
  //           unitPrice: 200,
  //           totalPrice: 4 * 200,
  //           Service: {
  //             id: '8a5c46c9-fbfe-4194-bfc9-30cf766230f6',
  //             assignmentId: 'c8a9f96c-e48b-494f-a5db-6c405fd9834e',
  //             name: 'Manutenção',
  //             description: 'Manutenção do carro',
  //             saleValue: 20,
  //             status: GenericStatus.active,
  //           },
  //           Assignment: {
  //             id: 'c8a9f96c-e48b-494f-a5db-6c405fd9834e',
  //             name: 'Manutenção',
  //             description: 'Manutenção do carro',
  //             accountRequirement: false,
  //             accountType: AccountType.RECEPTIONIST,
  //             peopleServed: 45,
  //             status: GenericStatus.active,
  //             paymentMethod: PaymentMethod.DAY,
  //             paymentValue: 200,
  //           },
  //         },
  //       ],
  //       budgetProducts: [
  //         {
  //           id: 0,
  //           productId: '18b1b29a-2296-4f06-9c16-10bdb6dcdebb',
  //           budgetId: '18b1b29a-2296-4f06-9c16-10bdb6dcdecc',
  //           quantity: 125,
  //           unitPrice: 5,
  //           totalPrice: 125 * 5,
  //           Product: {
  //             id: '18b1b29a-2296-4f06-9c16-10bdb6dcdebb',
  //             name: 'Mesa',
  //             description: 'Mesa gamer com 4 rodas',
  //             measurementUnit: MeasurementUnit.UNIT,
  //             status: GenericStatus.active,
  //             consumptionPerPerson: 4,
  //             productType: ProductType.Rental,
  //             SaleValue: 20,
  //             quantity: 15,
  //             value: 55,
  //             numberDay: 4,
  //             percentage: 0,
  //           },
  //         },
  //       ],
  //     },
  //   ],

  //   page: 0,
  //   totalPages: 0,
  // };
}

async function create(data: CreateBudgetRequestData): Promise<Budget> {
  return Api.post(baseUrl, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS03 },
  }).then((res) => res.data);
}

async function update(data: Budget): Promise<Budget> {
  return Api.put(`${baseUrl}/${data.id}`, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS02 },
  }).then((res) => res.data);
}

async function changeStatus(
  id: string,
  status: GenericStatus
): Promise<Budget> {
  return Api.patch(
    `${baseUrl}/${id}`,
    { status },
    { headers: { authHeader: true, 'success-message': SuccessMessages.MSGS04 } }
  ).then((res) => res.data);
  // return {
  //   id: 'asdfasdf1',
  //   customerId: 'id do cliente',
  //   pickupDate: new Date(),
  //   hiringPeriod: 0,
  //   totalAmount: 0,
  //   discount: 0,
  // budgetDetails: [
  //   {
  //     id: 0,
  //     productId: 'id do produto',
  //     quantity: 0,
  //     budgetId: 0,
  //     unitPrice: 0,
  //     totalPrice: 0,
  //     serviceId: 'id do serviço',
  //   },
  // ],
}

export const budgetService = { getPaginated, create, update, changeStatus };

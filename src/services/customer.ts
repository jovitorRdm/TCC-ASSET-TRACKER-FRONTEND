import { PaginatedDataResponse, PaginatedRequestParams } from '@/types/paginatedData';
import Api from './api';
import { SuccessMessages } from '@/types/messages';
import { GenericStatus } from '@/types/genericStatus';
import { CreateCustomerRequestData, Customer } from '@/types/customer';

const baseUrl = '/customer';

async function getPaginated(
  params?: PaginatedRequestParams
): Promise<PaginatedDataResponse<Customer>> {
  return Api.get(baseUrl, { params, headers: { authHeader: true } }).then(
    (res) => res.data
  );
}

async function create(data: CreateCustomerRequestData): Promise<Customer> {
  return Api.post(baseUrl, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS01 },
  }).then((res) => res.data);
}

async function update(data: Customer): Promise<Customer> {
  return Api.put(`${baseUrl}/${data.id}`, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS02 },
  }).then((res) => res.data);
}

async function changeStatus(
  id: string,
  status: GenericStatus
): Promise<Customer> {
  return Api.patch(
    `${baseUrl}/${id}`,
    { status },
    { headers: { authHeader: true, 'success-message': SuccessMessages.MSGS04 } }
  ).then((res) => res.data);
}

async function resetPassword(id: string): Promise<Customer> {
  return Api.put(
    `${baseUrl}/${id}/reset-password`,
    {},
    {
      headers: { authHeader: true, 'success-message': SuccessMessages.MSGS01 },
    }
  ).then((res) => res.data);
}

export const customerService = {
  getPaginated,
  create,
  update,
  changeStatus,
  resetPassword,
};

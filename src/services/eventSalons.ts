import Api from './api';
import { SuccessMessages } from '@/types/messages';
import { GenericStatus } from '@/types/genericStatus';
import {
  PaginatedDataResponse,
  PaginatedRequestParams,
} from '@/types/paginatedData';
import { CreateEventSalonsRequestData, EventSalons } from '@/types/eventSalons';

const baseUrl = '/eventSalons';

async function getPaginated(
  params?: PaginatedRequestParams
): Promise<PaginatedDataResponse<EventSalons>> {
  return Api.get(baseUrl, { params, headers: { authHeader: true } }).then(
    (res) => res.data
  );
}

async function create(
  data: CreateEventSalonsRequestData
): Promise<EventSalons> {
  return Api.post(baseUrl, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS03 },
  }).then((res) => res.data);
}

async function update(data: EventSalons): Promise<EventSalons> {
  return Api.put(`${baseUrl}/${data.id}`, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS02 },
  }).then((res) => res.data);
}

async function changeStatus(
  id: string,
  status: GenericStatus
): Promise<EventSalons> {
  return Api.patch(
    `${baseUrl}/${id}`,
    { status },
    { headers: { authHeader: true, 'success-message': SuccessMessages.MSGS04 } }
  ).then((res) => res.data);
}

export const eventSalonsService = {
  getPaginated,
  create,
  update,
  changeStatus,
};

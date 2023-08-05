
import Api from './api';
import { SuccessMessages } from '@/types/messages';
import { GenericStatus } from '@/types/genericStatus';
import { PaginatedDataResponse, PaginatedRequestParams } from '@/types/paginatedData';
import { CreateEventRequestData, EventType } from '@/types/event';

const baseUrl = '/event';

async function getPaginated(
    params?: PaginatedRequestParams
): Promise<PaginatedDataResponse<EventType>> {
    return Api.get(baseUrl, { params, headers:{authHeader: true}  }).then((res) => res.data);
}

async function create(data: CreateEventRequestData): Promise<EventType> {
    return Api.post(baseUrl, data, {
        headers: { authHeader: true,'success-message': SuccessMessages.MSGS03 },
    }).then((res) => res.data);
}

async function update(data: EventType): Promise<EventType> {
    return Api.put(`${baseUrl}/${data.id}`, data, {
        headers: { authHeader: true,'success-message': SuccessMessages.MSGS02 },
    }).then((res) => res.data);
}

async function changeStatus(
    id: string,
    status: GenericStatus
): Promise<EventType> {
    return Api.patch(
        `${baseUrl}/${id}`,
        { status },
        { headers: { authHeader: true,'success-message': SuccessMessages.MSGS04 } }
    ).then((res) => res.data);
}

export const eventService = { getPaginated, create, update, changeStatus };

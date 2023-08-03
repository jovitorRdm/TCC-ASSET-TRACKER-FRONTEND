
import Api from './api';
import { SuccessMessages } from '@/types/messages';
import { GenericStatus } from '@/types/genericStatus';
import { PaginatedDataResponse, PaginatedRequestParams } from '@/types/paginatedData';
import { InputServiceItemRequestData, ServiceItem } from '@/types/serviceItem';

const baseUrl = '/serviceItem';
async function getPaginated(
    params?: PaginatedRequestParams
): Promise<PaginatedDataResponse<ServiceItem>> {
    return Api.get(baseUrl, { params, headers:{authHeader: true}  }).then((res) => res.data);
}

async function create(data: InputServiceItemRequestData): Promise<ServiceItem> {
    return Api.post(baseUrl, data, {
        headers: { authHeader: true,'success-message': SuccessMessages.MSGS03 },
    }).then((res) => res.data);
}

async function update(data: InputServiceItemRequestData): Promise<ServiceItem> {
    return Api.put(`${baseUrl}/${data.id}`, data, {
        headers: { authHeader: true,'success-message': SuccessMessages.MSGS02 },
    }).then((res) => res.data);
}

async function changeStatus(
    id: string,
    status: GenericStatus
): Promise<ServiceItem> {
    return Api.patch(
        `${baseUrl}/${id}`,
        { status },
        { headers: { authHeader: true,'success-message': SuccessMessages.MSGS04 } }
    ).then((res) => res.data);
}

export const servicesItemService = { getPaginated, create, update, changeStatus };

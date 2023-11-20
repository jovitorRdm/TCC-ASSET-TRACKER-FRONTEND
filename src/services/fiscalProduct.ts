import Api from './api';
import { SuccessMessages } from '@/types/messages';
import { GenericStatus } from '@/types/genericStatus';
import { PaginatedDataResponse, PaginatedRequestParams } from '@/types/paginatedData';
import {  FiscalProduct, InputFiscalProductRequestData } from '@/types/fiscalProduct';

const baseUrl = '/fiscalProduct';

async function getPaginated(
    params?: PaginatedRequestParams
): Promise<PaginatedDataResponse<FiscalProduct>> {
    return Api.get(baseUrl, { params, headers:{authHeader: true}  }).then((res) => res.data);
}

async function create(data: InputFiscalProductRequestData): Promise<FiscalProduct> {
    return Api.post(baseUrl, data, {
        headers: { authHeader: true,'success-message': SuccessMessages.MSGS03 },
    }).then((res) => res.data);
}

async function update(data: FiscalProduct): Promise<FiscalProduct> {
    return Api.put(`${baseUrl}/${data.id}`, data, {
        headers: { authHeader: true,'success-message': SuccessMessages.MSGS02 },
    }).then((res) => res.data);
}

async function changeStatus(
    id: string,
    status: GenericStatus
): Promise<FiscalProduct> {
    return Api.patch(
        `${baseUrl}/${id}`,
        { status },
        { headers: { authHeader: true,'success-message': SuccessMessages.MSGS04 } }
    ).then((res) => res.data);
}

export const fiscalProductService = { getPaginated, create, update, changeStatus };

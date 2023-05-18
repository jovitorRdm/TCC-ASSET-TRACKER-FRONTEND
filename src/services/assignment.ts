
import Api from './api';
import { SuccessMessages } from '@/types/messages';
import { GenericStatus } from '@/types/genericStatus';
import { PaginatedDataResponse, PaginatedRequestParams } from '@/types/paginatedData';
import { Assignment, CreateAssignmentRequestData } from '@/types/assignment';

const baseUrl = '/assignment';

async function getPaginated(
    params?: PaginatedRequestParams
): Promise<PaginatedDataResponse<Assignment>> {
    return Api.get(baseUrl, { params }).then((res) => res.data);
}

async function create(data: CreateAssignmentRequestData): Promise<Assignment> {
    return Api.post(baseUrl, data, {
        headers: { 'success-message': SuccessMessages.MSGS03 },
    }).then((res) => res.data);
}

async function update(data: Assignment): Promise<Assignment> {
    return Api.put(`${baseUrl}/${data.id}`, data, {
        headers: { 'success-message': SuccessMessages.MSGS02 },
    }).then((res) => res.data);
}

async function changeStatus(
    id: string,
    status: GenericStatus
): Promise<Assignment> {
    return Api.patch(
        `${baseUrl}/${id}`,
        { status },
        { headers: { 'success-message': SuccessMessages.MSGS04 } }
    ).then((res) => res.data);
}

export const assignmentService = { getPaginated, create, update, changeStatus };

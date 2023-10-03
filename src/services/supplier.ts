import { PaginatedDataResponse, PaginatedRequestParams } from "@/types/paginatedData";
import { CreateSupplierRequestData, Supplier } from "@/types/supplier";
import Api from "./api";
import { SuccessMessages } from "@/types/messages";
import { GenericStatus } from "@/types/genericStatus";


const baseUrl = "/supplier"

async function getPaginated(
    params?: PaginatedRequestParams
): Promise<PaginatedDataResponse<Supplier>> {
    return Api.get(baseUrl, { params, headers: { authHeader: true } }).then(
        (res) => res.data
    );
}

async function create(data: CreateSupplierRequestData): Promise<Supplier> {
    return Api.post(baseUrl, data, {
        headers: { authHeader: true, 'success-message': SuccessMessages.MSGS01 },
    }).then((res) => res.data);
}

async function update(data: Supplier): Promise<Supplier> {
    return Api.put(`${baseUrl}/${data.id}`, data, {
        headers: { authHeader: true, 'success-message': SuccessMessages.MSGS02 },
    }).then((res) => res.data);
}

async function changeStatus(
    id: string,
    status: GenericStatus
): Promise<Supplier> {
    return Api.patch(
        `${baseUrl}/${id}`,
        { status },
        { headers: { authHeader: true, 'success-message': SuccessMessages.MSGS04 } }
    ).then((res) => res.data);
}

export const supplierService = {
    getPaginated,
    create,
    update,
    changeStatus
};
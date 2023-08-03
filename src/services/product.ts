import { PaginatedDataResponse, PaginatedRequestParams } from "@/types/paginatedData";
import Api from "./api";
import { InputProductRequestData, Product } from "@/types/product";
import { SuccessMessages } from "@/types/messages";
import { GenericStatus } from "@/types/genericStatus";

const baseUrl = '/product';
async function getPaginated(
    params?: PaginatedRequestParams
): Promise<PaginatedDataResponse<Product>> {
    return Api.get(baseUrl, { params, headers:{authHeader: true}  }).then((res) => res.data);
}

async function create(data: InputProductRequestData): Promise<Product> {
    return Api.post(baseUrl, data, {
        headers: { authHeader: true,'success-message': SuccessMessages.MSGS03 },
    }).then((res) => res.data);
}

async function update(data: InputProductRequestData): Promise<Product> {
    return Api.put(`${baseUrl}/${data.id}`, data, {
        headers: { authHeader: true,'success-message': SuccessMessages.MSGS02 },
    }).then((res) => res.data);
}

async function changeStatus(
    id: string,
    status: GenericStatus
): Promise<Product> {
    return Api.patch(
        `${baseUrl}/${id}`,
        { status },
        { headers: { authHeader: true,'success-message': SuccessMessages.MSGS04 } }
    ).then((res) => res.data);
}

export const productService = { getPaginated, create, update, changeStatus };
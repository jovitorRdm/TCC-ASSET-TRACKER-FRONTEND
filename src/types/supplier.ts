import { Address } from "./address";
import { GenericStatus } from "./genericStatus";

export interface CreateSupplierRequestData {
    name: string;
    document: string;
    birthdate: string
    phoneNumber: string
    email: string
    address: Address
}

export interface Supplier extends CreateSupplierRequestData {
    id?: string;
    status: GenericStatus;
  }
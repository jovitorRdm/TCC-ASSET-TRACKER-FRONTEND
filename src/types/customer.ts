import { Address } from "./address";
import { GenericStatus } from "./genericStatus";

export interface CreateCustomerRequestData {
    name: string;
    document: string;
    birthdate: string
    phoneNumber: string
    email: string
    address: Address
}

export interface Customer extends CreateCustomerRequestData {
    id?: string;
    status: GenericStatus;
  }
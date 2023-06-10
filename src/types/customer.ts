import { Address } from "./address";
import { GenericStatus } from "./genericStatus";

export interface CreateCustomerRequestData {
    name: string;
    cpf: string;
    birthdate: string
    phoneNumber: string
    email: string
    password: string
    address: Address

}

export interface Customer extends CreateCustomerRequestData {
    id?: string;
    status: GenericStatus;
  }
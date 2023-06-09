import { Address } from "./address";
import { Assignment } from "./assignment";
import { GenericStatus } from "./genericStatus";

export interface CreateEmployeeRequestData {
    name: string;
    cpf: string;
    birthdate: string
    phoneNumber: string
    email: string
    password: string
    address: Address
    assignmentId: string
    assignment:Assignment

}

export interface Employee extends CreateEmployeeRequestData {
    id?: string;
    status: GenericStatus;
  }
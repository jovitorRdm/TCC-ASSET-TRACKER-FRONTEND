import { AccountType } from "./accountType";
import { GenericStatus } from "./genericStatus";
import { PaymentMethod } from "./paymentMethod";

export interface Assignment {
    id?: string;
    status: GenericStatus;
    name: string;
    description: string;
    paymentMethod: PaymentMethod;
    paymentValue: number;
    accountRequirement: boolean;
    accountType: AccountType;

}

export interface CreateAssignmentRequestData {
    name: string;
    description: string;
    paymentMethod: PaymentMethod;
    paymentValue: number;
    accountRequirement: boolean;
    accountType: AccountType;
}
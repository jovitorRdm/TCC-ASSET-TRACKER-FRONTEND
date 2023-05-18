import { GenericStatus } from "./genericStatus";
import { PaymentMethod } from "./paymentMethod";

export interface Assignment {
    id?: string;
    status: GenericStatus;
    name: string;
    description: string;
    paymentMethod: PaymentMethod;
    paymentValue: number;
}

export interface CreateAssignmentRequestData {
    name: string;
    description: string;
    paymentMethod: PaymentMethod;
    paymentValue: number;
}
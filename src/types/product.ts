import { Assignment } from "./assignment";
import { GenericStatus } from "./genericStatus";

export interface Product {
    id?: string;
    status: GenericStatus;
    name: string;
    description: string;
    productValue: number;
    productQuantity: number;
    assignments: Assignment[];
}

export interface InputProductRequestData {
    id?: string;
    name: string;
    description: string;
    productValue: number;
    productQuantity: number;
    assignments: Assignment[];
}
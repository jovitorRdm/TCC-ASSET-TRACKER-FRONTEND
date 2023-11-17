import { Assignment } from "./assignment";
import { GenericStatus } from "./genericStatus";
import { MeasurementUnit } from "./measurementUnite";

export interface Product {
    id?: string;
    status: GenericStatus;
    name: string;
    description: string;
    measurementUnit: MeasurementUnit;
    consumptionPerPerson: number;
    quantity: number;
    value: number;
}

export interface InputProductRequestData {
    id?: string;
    status: GenericStatus;
    name: string;
    description: string;
    measurementUnit: MeasurementUnit;
    consumptionPerPerson: number;
    quantity: number;
    value: number;
}
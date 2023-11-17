import { GenericStatus } from "./genericStatus";
import { Product } from "./product";
import { Supplier } from "./supplier";


export interface CreateFiscalProductRequestData{
    supplier: Supplier;
    invoiceNumber: string;
    issueDate: Date;
    Product: Product[];
}

export interface FiscalProduct extends CreateFiscalProductRequestData{
    id: string;
    status: GenericStatus;
}

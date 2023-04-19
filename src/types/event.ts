import { GenericStatus } from './genericStatus';

export interface Discipline {
    id?: string;
    status: GenericStatus;
    name: string;
    description: string;
}

export interface CreateEventRequestData {
    name: string;
    description: string;
}

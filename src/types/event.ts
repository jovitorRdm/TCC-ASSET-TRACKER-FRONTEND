import { GenericStatus } from './genericStatus';

export interface EventType {
    id?: string;
    status: GenericStatus;
    name: string;
    description: string;
}

export interface CreateEventRequestData {
    name: string;
    description: string;
}

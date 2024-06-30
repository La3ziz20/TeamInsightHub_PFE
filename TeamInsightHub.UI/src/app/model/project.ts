import { User } from "./user";

export class Project {
    id!: string;
    title!: string;
    description!: string;
    status!: string;
    startDate!: Date;
    endDate!: Date;
    technology!: string;
    details!: string;
    clientId!: string;
    consultants?: User[];


}
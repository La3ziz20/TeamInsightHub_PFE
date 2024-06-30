import { UserRole } from "../enums/user-role.enum";

export interface UserDto {
    id: string;
    firstname: string;
    lastname: string;
    address: string;
    skils: string;
    certificate: string;
    email: string;
    phone: string ;
    createdAt: Date;
    role: UserRole;
  }
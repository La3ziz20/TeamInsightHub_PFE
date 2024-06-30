import { Role } from "../enum/role.enum";

export interface UserDto {
  id: string;
  firstname: string;
  lastname: string;
  address: string;
  skils: string;
  certificate: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: Date;
}


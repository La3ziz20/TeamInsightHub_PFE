/* eslint-disable prettier/prettier */

import { Role } from "../enum/role.enum";


export interface signUpDto {
  id: string;
  firstname: string;
  lastname: string;
  address: string;
  skils: string;
  certificate: string;
  password: string;
  email: string;
  phone: string ;
  role: Role;
}

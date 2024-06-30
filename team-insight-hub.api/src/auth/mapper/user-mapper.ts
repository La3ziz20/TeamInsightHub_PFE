/* eslint-disable prettier/prettier */

import { User } from 'src/schemas';
import { UserDto } from '../dto/user.dto';

export function mapUserEntityToUserDto(user: User): UserDto {
  return {
    id: user.id,
    firstname: user.firstname,
    skils: user.skils,
    certificate: user.certificate,
    address: user.address,
    email: user.email,
    lastname: user.lastname,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };
}

/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class LoginDto {
 
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email address' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
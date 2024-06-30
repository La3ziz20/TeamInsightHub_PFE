/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { signUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import { Role } from './enum/role.enum';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpdto: signUpDto) {
    return this.authService.signUp(signUpdto);
  }

  @Get()
  async getAllUserss(): Promise<UserDto[]> {
    return await this.authService.getAllUsers();
  }

  @Post('/login')
  async login(@Body() logindto: LoginDto): Promise<{ token: string }> {
    try {
      return await this.authService.login(logindto);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<UserDto> {
    return await this.authService.getUserByEmail(email);
  }

  @Get('id/:id')
  async getUserById(@Param('id') id: string): Promise<UserDto> {
    return await this.authService.getSpecificUserById(id);
  }

  @Delete('delete/:id')
  async deletUser(@Param('id') _id: string): Promise<UserDto> {
    const deletedUser = await this.authService.deletUser(_id);
    return deletedUser;
  }

  @Put('update/:id')
  async updateUser(
    @Param('id') _id: string,
    @Body() updatedUserDto: UserDto,
  ): Promise<UserDto> {
    const updatedUser = await this.authService.updateUser(_id, updatedUserDto);

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${_id} not found`);
    }
    return updatedUser;
  }

  @Put('changePassword/:userId')
  async changePassword(
    @Param('userId') userId: string,
    @Body() changePasswordDto: { oldPassword: string; newPassword: string },
  ) {
    return await this.authService.chagnePassword(userId, changePasswordDto);
  }

  @Put('changeRole/:userId')
    async changeUserRole(
      @Param('userId') userId: string, 
      @Body('role') newRole: Role): Promise<UserDto> {
        const user = await this.authService.changeUserRole(userId, newRole);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }
}

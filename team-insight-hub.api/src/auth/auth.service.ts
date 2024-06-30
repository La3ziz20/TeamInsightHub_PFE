/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { signUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { mapUserEntityToUserDto } from './mapper/user-mapper';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { PostService } from 'src/post/post.service';
import { CommentService } from 'src/comment/comment.service';
import { Role } from './enum/role.enum';


export interface IUserService {
  getAllUsers(): Promise<UserDto[]>;
  getSpecificUserById(UserId: string): Promise<UserDto>;
  deletUser(UserId: string): Promise<UserDto>;
  updateUser(UserId: string, updateUserDto: UserDto): Promise<UserDto>;
  signUp(createUserDto: signUpDto): Promise<UserDto>;
  login(loginDto: LoginDto): Promise<{ token: string }>;
  getUserByEmail(email: string): Promise<UserDto>;
  chagnePassword(
    UserId: string,
    changePasswordDto: { oldPassword: string; newPassword: string },
  ): Promise<Boolean>;
}
@Injectable()
export class AuthService implements IUserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
    @Inject(forwardRef(() => PostService)) private readonly postservice: PostService,
    @Inject(forwardRef(() => CommentService)) private readonly commentService: CommentService
  ) { }
  public async signUp(createUserDto: signUpDto): Promise<UserDto> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = new this.userModel({
        firstname: createUserDto.firstname,
        lastname: createUserDto.lastname,
        phone: createUserDto.phone,
        password: hashedPassword,
        address: createUserDto.address,
        skils: createUserDto.skils,
        certificate: createUserDto.certificate,
        email: createUserDto.email,
      });
      const generatedUser = await newUser.save();
      return mapUserEntityToUserDto(generatedUser);
    } catch (error) {
      throw new BadRequestException('something went wrong');
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    try {
      const user = await this.userModel.findOne({ email: loginDto.email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const userDto = mapUserEntityToUserDto(user);
      const token = jwt.sign(userDto, process.env.JWT_SECRET);
      return {
        token: token,
      };
    } catch (error) {
      throw new Error(`Failed to login: ${error.message}`);
    }
  }

  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userModel.find();
    if (users.length == 0) {
      throw new NotFoundException('No users found.');
    }
    return users.map((user) => mapUserEntityToUserDto(user));
  }

  async getUserByEmail(email: string): Promise<UserDto> {
    try {
      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new NotFoundException('Could not find user.');
      }

      return mapUserEntityToUserDto(user);
    } catch (error) {
      throw new NotFoundException('Could not find user.');
    }
  }

  async getSpecificUserById(_id: string): Promise<UserDto> {
    let fetchedUser;
    try {
      fetchedUser = await this.userModel.findById(_id);
    } catch (error) {
      throw new NotFoundException('Could not found user.');
    }

    if (!fetchedUser) {
      throw new NotFoundException('Could not found user.');
    }
    return mapUserEntityToUserDto(fetchedUser);
  }

  public async deletUser(userId: string): Promise<UserDto> {
    this.postservice.deletePostByUserId(userId);
    this.commentService.deleteCommentByUserId(userId);
    const deleteduser = await this.userModel.findByIdAndDelete(userId);

    if (!deleteduser) throw new NotFoundException(`Can't find by ${userId}`);
    return mapUserEntityToUserDto(deleteduser);
  }

  async updateUser(id: string, updateUserDto: UserDto): Promise<UserDto> {
    const existingUser = await this.userModel.findById(id);

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.email !== existingUser.email) {
      const userWithSameEmail = await this.userModel.findOne({
        email: updateUserDto.email,
      });
      if (userWithSameEmail) {
        throw new BadRequestException('Email already exists');
      }
    }

    existingUser.firstname = updateUserDto.firstname;
    existingUser.lastname = updateUserDto.lastname;
    existingUser.email = updateUserDto.email;
    existingUser.skils = updateUserDto.skils;
    existingUser.certificate = updateUserDto.certificate;
    existingUser.address = updateUserDto.address;
    existingUser.phone = updateUserDto.phone;
    await existingUser.save();
    return mapUserEntityToUserDto(existingUser);
  }

  async chagnePassword(
    UserId: string, changePasswordDto: { oldPassword: string; newPassword: string }
  ) {
    const user = await this.userModel.findById(UserId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return true;
  }

  async changeUserRole(userId: string, newRole: Role): Promise<UserDto> {
    const user = await this.userModel.findByIdAndUpdate(userId, { role: newRole }, { new: true });
    if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }
}

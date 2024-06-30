/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PostModule } from 'src/post/post.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          }
        };
      }
    }),
    MongooseModule.forFeature(
      [{ name: 'User', schema: UserSchema }]
    ),
    PostModule, CommentModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PostModule, CommentModule],
  exports: [JwtStrategy, PassportModule, AuthService]
})
export class AuthModule { }
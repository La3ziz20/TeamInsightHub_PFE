/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from 'src/schemas';
import { ClientModule } from 'src/client/client.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
    forwardRef(() => ClientModule),
    AuthModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}

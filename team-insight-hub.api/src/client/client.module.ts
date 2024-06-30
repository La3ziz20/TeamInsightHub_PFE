/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientSchema } from 'src/schemas/client.schema';
import { ProjectModule } from 'src/project/project.module';
@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Client', schema: ClientSchema }]
    ), forwardRef(() => ProjectModule),
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService]
})
export class ClientModule { }
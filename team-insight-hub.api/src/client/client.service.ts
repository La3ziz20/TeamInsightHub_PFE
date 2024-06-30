
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from 'src/schemas/client.schema';
import { ClientDto } from './dtos/clientDto';
import { mapClientEntityToDto } from './mappers/client-mapper';
import { Project } from 'src/schemas/project.schema';
import { ProjectService } from 'src/project/project.service';



export interface IClientService {
  //you should define all your methods here: method name, input, output.
  getAllClients(): Promise<ClientDto[]>;
  getSpecificClient(clientId: string): Promise<ClientDto>;
  createClient(createClientDto: ClientDto): Promise<ClientDto>;
  deletClient(clientId: string): Promise<ClientDto>;
  updateClient(clientId: string, updateClientDto: ClientDto): Promise<ClientDto>
}

@Injectable()
export class ClientService implements IClientService {

  constructor(@InjectModel('Client') private readonly clientModel: Model<Client>,
    @Inject(forwardRef(() => ProjectService)) private readonly projectService: ProjectService) { }

  async getAllClients(): Promise<ClientDto[]> {
    const clients = await this.clientModel.find();
    if (clients.length == 0) {
      throw new NotFoundException('No clients found.');
    }
    return clients.map((client) => (mapClientEntityToDto(client)));
  }
  async getSpecificClient(clientId: string): Promise<ClientDto> {
    let fetchedClient;
    try {
      fetchedClient = await this.clientModel.findById(clientId);
    } catch (error) {
      throw new NotFoundException('Could not found client.');
    }

    if (!fetchedClient) {
      throw new NotFoundException('Could not found client.');
    }
    return mapClientEntityToDto(fetchedClient);
  }

  public async createClient(createClientDto: ClientDto): Promise<ClientDto> {
    try {
      const newClient = new this.clientModel({
        name: createClientDto.name,
        description: createClientDto.description,
        address: createClientDto.address,
        email: createClientDto.email,
      });
      const generatedClient = await newClient.save();
      return mapClientEntityToDto(generatedClient);
    } catch (error) {
      throw new BadRequestException('something went wrong'); // to create global error handling.. for resuability
    }
  }
  public async deletClient(clientId: string): Promise<ClientDto> {
    this.projectService.deleteProjectsByClientId(clientId);
    const deletedClient = await this.clientModel.findByIdAndDelete(clientId);

    if (!deletedClient)
      throw new NotFoundException(`Can't find by ${clientId}`);
    return mapClientEntityToDto(deletedClient);
  }
  async updateClient(clientId: string, updateClientDto: ClientDto): Promise<ClientDto> {
    const existingClient = await this.clientModel.findByIdAndUpdate(clientId, updateClientDto, { new: true });

    if (!existingClient) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    return mapClientEntityToDto(existingClient);
  }

}

/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientDto } from './dtos/clientDto';

@Controller('api/client')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }
  @Post()
  async create(@Body() createClientDto: ClientDto): Promise<ClientDto> {
    try {
      const createdClient = await this.clientService.createClient(createClientDto);
      return createdClient;
    } catch (error) {
      throw new HttpException('An error occurred while creating the client.', HttpStatus.BAD_REQUEST);
    }
  }
  @Get()
  async getAllClients(): Promise<ClientDto[]> {
    return await this.clientService.getAllClients();
  }
  @Get('/:id')
  async getClientById(@Param('id') clientId: string): Promise<ClientDto> {
    return await this.clientService.getSpecificClient(clientId);
  }
  @Delete('/:id')
  async deletClient(@Param('id') clientId: string): Promise<ClientDto> {
    const deletedClient = await this.clientService.deletClient(clientId);
    return deletedClient;
  }
  @Put(':id')
  async updateClient(@Param('id') clientId: string, @Body() updateClientDto: ClientDto): Promise<ClientDto> {
    const updatedClient = await this.clientService.updateClient(clientId, updateClientDto);

    if (!updatedClient) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }
    return updatedClient;
  }
}
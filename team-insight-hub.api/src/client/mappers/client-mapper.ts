import { Client } from "src/schemas/client.schema";
import { ClientDto } from "../dtos/clientDto";

export function mapClientEntityToDto(client: Client): ClientDto {
    return {
        id: client.id,
        name: client.name,
        description: client.description,
        address: client.address,
        email: client.email
      }
}
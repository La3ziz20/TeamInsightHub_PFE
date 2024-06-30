import { Injectable } from '@angular/core';
import { Client } from '../model/client';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = environment.ApiBaseUrl + '/api/client/'
  constructor(private http: HttpClient) { }


  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }
  deleteClient(clientId: string) {
    return this.http.delete(this.apiUrl + clientId);
  }
  updateClient(updateClientDto: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}${updateClientDto.id}`, updateClientDto);
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(this.apiUrl + id);
  }
}
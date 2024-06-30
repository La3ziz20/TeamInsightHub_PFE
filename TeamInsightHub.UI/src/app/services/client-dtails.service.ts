import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../model/project';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class ClientDtailsService {
  private apiUrl = environment.ApiBaseUrl + '/api/projects/'
  constructor(private http: HttpClient) { }

  getProjectsByClient(clientId: string): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl + 'byClient/' + clientId);
  }
  deletProject(projectId: string) {
    return this.http.delete(this.apiUrl + projectId);
  }
  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(this.apiUrl + id);
  }

  updateProject(updateproject: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}${updateproject.id}`, updateproject);
  }
  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }
  getAllProject(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getProjectsByConsultant(consultantId: string): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl + 'byConsultantId/' + consultantId);
  }
}

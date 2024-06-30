import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Project } from '../model/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailsService {
  private apiUrl = environment.ApiBaseUrl + '/api/projects/'
  constructor(private http: HttpClient) { }

  updateConsultantsInProject(projectId: string, consultantIds: string[]): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}editConsultants/${projectId}`, { consultantIds });
  }
  deletConsultantFromProject(projectId: string, consultantId: string): Observable<Project> {
    return this.http.delete<Project>(`${this.apiUrl}deleteConsultant/${projectId}/${consultantId}`)
  }
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }
}

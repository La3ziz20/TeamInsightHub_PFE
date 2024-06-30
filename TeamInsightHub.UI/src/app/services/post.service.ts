import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Post } from '../model/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = environment.ApiBaseUrl + '/api/post/'
  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }



  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  updatePost(id: string, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}${id}`, post);
  }

  deletePost(id: string): Observable<Post> {
    return this.http.delete<Post>(`${this.apiUrl}${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

import { Comment } from '../model/post';
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = environment.ApiBaseUrl + '/api/comment/'

  constructor(private http: HttpClient) { }

  createComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }

  getCommentsByPostId(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/postID/${postId}`);
  }

  editComment(commentId: string, updateCommentDto: any): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}${commentId}`, updateCommentDto);
  }

  deleteComment(commentId: string): Observable<Comment> {
    return this.http.delete<Comment>(`${this.apiUrl}${commentId}`);
  }
}

import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserDto } from '../dtos/user.dto';
import { UserRole } from '../enums/user-role.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.ApiBaseUrl + '/api/auth/';
  constructor(private http: HttpClient) {}
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  deleteUser(_id: string) {
    return this.http.delete(this.baseUrl + 'delete/' + _id);
  }

  updateUser(updateUserDto: UserDto, _id: string): Observable<UserDto> {
    return this.http.put<UserDto>(
      this.baseUrl + 'update/' + _id,
      updateUserDto
    );
  }

  getUserById(id: string): Observable<UserDto> {
    return this.http.get<UserDto>(this.baseUrl + 'id/' + id);
  }

  getUserByEmail(email: string): Observable<UserDto> {
    return this.http.get<UserDto>(this.baseUrl + 'email/' + email);
  }

  changePassword(
    userId: string,
    changePasswordDto: { oldPassword: string; newPassword: string }
  ): Observable<Boolean> {
    return this.http.put<Boolean>(
      this.baseUrl + 'changePassword/' + userId,
      changePasswordDto
    );
  }

  updateUserRole(_id: string, role: UserRole): Observable<UserDto> {
    return this.http.put<UserDto>(
      `${this.baseUrl}changeRole/${_id}`,
      { role }
    );
  }
}

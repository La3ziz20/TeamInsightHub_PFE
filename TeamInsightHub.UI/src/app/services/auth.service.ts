import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '../model/user';
import { Auth } from '../model/auth';
import { LocalStorageService } from './local-storage.service';

const TOKEN_KEY = 'AuthToken';
const USER_INFO_KEY = 'AuthUserInfo';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.ApiBaseUrl + '/api/auth/';

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) { }

  signUp(signUpDto: User) {
    return this.http.post(this.baseUrl + 'signup', signUpDto);
  }

  login(loginDto: Auth): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(this.baseUrl + 'login', loginDto)
      .pipe(
        map((token) => {
          this.localStorageService.saveToken(token);
          return token;
        })
      );
  }
}

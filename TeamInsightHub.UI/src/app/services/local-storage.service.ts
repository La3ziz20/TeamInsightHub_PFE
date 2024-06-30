import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserDto } from '../dtos/user.dto';
import { UserRole } from '../enums/user-role.enum';

const TOKEN_KEY = 'AuthToken';
const USER_INFO_KEY = 'AuthUserInfo';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() { }

  saveToken(userInfo: { token: string }): void {
    localStorage.setItem(TOKEN_KEY, userInfo.token);
    const userDto = this.getDecodedAccessToken(userInfo.token);
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userDto));
  }

  getToken(): string {
    return localStorage.getItem(TOKEN_KEY) ?? '';
  }

  getUserInfo(): UserDto {
    return JSON.parse(localStorage.getItem(USER_INFO_KEY) ?? '{}');
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
  }

  isUserLogged(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  getDecodedAccessToken(token: string): UserDto {
    return jwtDecode(token);
  }
  isUserManager(): boolean {
    return this.getUserInfo()?.role === UserRole.MANAGER;
  }
}

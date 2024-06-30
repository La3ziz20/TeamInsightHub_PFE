import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from '@angular/compiler';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private localStorageService: LocalStorageService) { }
  intercept(
    request: HttpRequest<Token>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const useremail = this.getemailValue();
    return next.handle(request);
  }
  getemailValue() {
    return this.localStorageService.getToken();
  }
}

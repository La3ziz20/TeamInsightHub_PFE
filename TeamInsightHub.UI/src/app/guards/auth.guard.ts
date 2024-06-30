import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private localStorageService: LocalStorageService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.localStorageService.isUserLogged()) {
      const redirectAuthenticated = next.data['redirectAuthenticated'];
      if (redirectAuthenticated) {
        return this.router.parseUrl('/home'); // Redirect to home if authenticated
      } else {
        return true; // Allow access to the route
      }
    } else {
      this.toastr.error('Please login first', 'Error');
      return this.router.parseUrl('/login');
    }
  }
}

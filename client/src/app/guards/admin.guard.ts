import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    let isAdminAndAuthenticated =
      this.authService.isAdmin() && this.authService.isAuthenticated();
    if (!isAdminAndAuthenticated) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
    return isAdminAndAuthenticated;
  }
}

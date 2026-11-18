import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { TokenServiceService } from '../services/Token/token-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  token: string | null = null;
  tokenExpiration: any;

  constructor(private router: Router, private tokenSrv: TokenServiceService) {
  }

  // Runs on every navigation between child pages of the main layout
  canActivateChild(): boolean {
    return this.canActivate();
  }

  canActivate(): boolean {
    const token = this.tokenSrv.getToken();
    const tokenExpiration = this.tokenSrv.getUserDetails().tokenExpiration

    if (token && tokenExpiration) {
      const isExpired = new Date().getTime() > Number(tokenExpiration);

      if (!isExpired) {
        return true; // Token is valid and not expired
      } else {
        // Token expired, remove token and redirect to login
        this.tokenSrv.clearLoginDetails().then(() => {
          this.router.navigate(['/login']).then(() => {
            window.location.reload();
          });
        })
        return false;
      }
    } else {
      // If no token or expiration, redirect to the login page
      this.tokenSrv.clearLoginDetails().then(() => {
        this.router.navigate(['/login']).then(() => {
          window.location.reload();
        });
      });
      return false;
    }
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenServiceService } from '../services/Token/token-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  token: string | null = null;
  tokenExpiration: any;

  constructor(private router: Router, private tokenSrv: TokenServiceService) {
    // this.token = tokenSrv.getToken();
    // this.tokenExpiration = tokenSrv.getUserDetails().tokenExpiration
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
        this.tokenSrv.clearLoginDetails().then(()=>{
        this.router.navigate(['/login']);
        })
        return false;
      }
    } else {
      // If no token or expiration, redirect to the login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}

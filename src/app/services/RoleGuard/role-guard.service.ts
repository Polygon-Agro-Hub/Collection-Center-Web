import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenServiceService } from '../Token/token-service.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {
  userRole: string | null = null;

  constructor(private router: Router, private tokenSrv: TokenServiceService) {
    this.userRole = this.tokenSrv.getUserDetails().role;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this.userRole === 'Collection Center Head') {
      return true;
    } else {
      this.router.navigate(['/451']);
      return false;
    }
  }
}

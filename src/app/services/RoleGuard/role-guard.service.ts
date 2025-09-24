import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenServiceService } from '../Token/token-service.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {
  constructor(private router: Router, private tokenSrv: TokenServiceService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.tokenSrv.getUserDetails().role;
    const allowedRoles: string[] = route.data['roles'] || [];

    if (allowedRoles.includes(userRole)) {
      return true;
    } else {
      this.router.navigate(['/451']); // Unauthorized page
      return false;
    }
  }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { TokenServiceService } from '../Token/token-service.service';


@Injectable({
  providedIn: 'root'
})
export class CcmRoleGuardService {
  userRole: string | null = null;
  constructor(private router: Router, private tokenSrv: TokenServiceService) {
    this.userRole = this.tokenSrv.getUserDetails().role;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this.userRole === 'Collection Center Manager') {
      return true;
    } else {
      this.router.navigate(['/451']);
      return false;
    }
  }
}

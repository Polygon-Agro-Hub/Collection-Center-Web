import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {

  constructor(private router: Router) 
  { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = localStorage.getItem('role'); // Retrieve role from local storage

    if (userRole === 'Collection Center Head') {
      return true; 
    } else {
      this.router.navigate(['/dashbord']); 
      return false;
    }
  }
}

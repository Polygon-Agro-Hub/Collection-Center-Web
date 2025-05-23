import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenServiceService } from '../../services/Token/token-service.service';

@Component({
  selector: 'app-unauthorized-access-page',
  standalone: true,
  imports: [],
  templateUrl: './unauthorized-access-page.component.html',
  styleUrl: './unauthorized-access-page.component.css'
})
export class UnauthorizedAccessPageComponent {
  constructor(
    private router: Router,
    private tokenSrv: TokenServiceService,

  ) { }

  logOut() {
    this.tokenSrv.clearLoginDetails();
    this.router.navigate(['/login']);
  }

}

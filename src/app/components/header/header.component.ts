import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenServiceService } from '../../services/Token/token-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent{

  userImage:string | null = localStorage.getItem('profileImage')

  constructor(private router: Router,  private tokenSrv: TokenServiceService) {
    this.userImage = this.tokenSrv.getUserDetails().image
  }



  navigate(route: string) {
    this.router.navigate([route]);
  }
}

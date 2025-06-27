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

  userImage: string | null = null;

  constructor(private router: Router, private tokenSrv: TokenServiceService) {}

  ngOnInit(): void {
    const userDetails = this.tokenSrv.getUserDetails();
    this.userImage = userDetails.image;
    console.log('user image', this.userImage);
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
}

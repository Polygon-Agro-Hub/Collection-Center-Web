import { Component } from '@angular/core';
import { AuthService } from '../../../services/Auth-service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  showPassword: boolean = false;
  showPassword1: boolean = false;
  loginObj: Login;

  constructor(private authService:AuthService, private http:HttpClient, private router: Router){
    this.loginObj = new Login()
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordVisibility1(): void {
    this.showPassword1 = !this.showPassword1;
  }

}

export class Login{
  password: string;
  
  constructor(){
    this.password='';
  }

}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/Auth-service/auth.service';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  showPassword: boolean = false;
  loginObj: Login;
  disError: any;
  isLoading: boolean = false;
  role!: string;


  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenServiceService
  ) {
    this.loginObj = new Login();
  }

  ngOnInit() {
    this.tokenService.clearLoginDetails();
    this.clearAllCookies();
  }



  clearAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }


  }



  onLogin() {
    if (!this.loginObj.userName) {
      Swal.fire({
        icon: 'error',
        title: 'Unsuccessful',
        text: 'User Name is required',
      });
    }

    if (!this.loginObj.password) {
      Swal.fire({
        icon: 'error',
        title: 'Unsuccessful',
        text: 'Password is required',
      });

    }

    if (!this.loginObj.userName && !this.loginObj.password) {
      Swal.fire({
        icon: 'error',
        title: 'Unsuccessful',
        text: 'User Name and Password is required',
      });

    }

    if (this.loginObj.password && this.loginObj.userName) {
      this.isLoading = true;
      this.authService.login(this.loginObj.userName, this.loginObj.password).subscribe(
        (res: any) => {
          this.tokenService.saveLoginDetails(
            res.token,
            res.userName,
            res.userId,
            res.role,
            res.expiresIn,
            res.image
          );
          Swal.fire({
            icon: 'success',
            title: 'Logged',
            text: 'Successfully Logged In',
            showConfirmButton: false,
            timer: 1500
          });

          this.role = res.role;

          setTimeout(() => {
            if (res.updatedPassword == 0) {
              this.router.navigate(['/change-password']);
              this.isLoading = false;
            } else if (res.updatedPassword == 1) {
              if (this.role === 'Collection Center Manager') {
                this.router.navigate(['/dashbord']);
                this.isLoading = false;
              } else if (this.role === 'Collection Center Head') {
                this.router.navigate(['/centers']);
                this.isLoading = false;
              } else if (this.role === 'Distribution Center Head') {
                this.router.navigate(['/distribution-center']);
                this.isLoading = false;
              } else if (this.role === 'Distribution Center Manager') {
                this.router.navigate(['/distribution-center-dashboard']);
                this.isLoading = false;
              } else {
                this.router.navigate(['/'])
                this.isLoading = false;
              }
              
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Unsuccessful',
                text: 'Error occurred. Please contact Agro World Admin',
              });
              this.isLoading = false;
            }
          }, 0);
        },
        (error) => {
          this.isLoading = false;
          console.error('Error updating Market Price', error);
          this.disError = error.error?.error || 'An error occurred. Please try again.';
          Swal.fire({
            icon: 'error',
            title: 'Unsuccessful',
            text: this.disError,
          });
        }
      );
    }

  }



  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}


export class Login {
  userName: string;
  password: string;

  constructor() {
    this.userName = '';
    this.password = '';
  }

}


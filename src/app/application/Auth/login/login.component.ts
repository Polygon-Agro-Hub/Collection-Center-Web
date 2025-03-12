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
    // localStorage.removeItem('LoginToken');
  }



  onLogin() {
    console.log("Successfully click the button");

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
          Swal.fire({
            icon: 'success',
            title: 'Logged',
            text: 'Successfully Logged In',
            showConfirmButton: false,
            timer: 1500
          });


          localStorage.setItem("CCLoginToken", res.token)

          // Save token details synchronously
          this.tokenService.saveLoginDetails(
            res.token,
            res.userName,
            res.userId,
            res.role,
            res.expiresIn,
            res.image
          );
          this.isLoading = true;


          // Defer navigation to allow the token to be saved properly
          setTimeout(() => {
            if (res.updatedPassword == 0) {
              this.router.navigate(['/change-password']);
            } else if (res.updatedPassword == 1) {
              this.router.navigate(['/dashbord']);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Unsuccessful',
                text: 'Error occurred. Please contact Agro World Admin',
              });
            }
          }, 0);
        },
        (error) => {
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


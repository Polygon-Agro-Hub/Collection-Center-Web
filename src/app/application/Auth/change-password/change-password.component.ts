import { Component } from '@angular/core';
import { AuthService } from '../../../services/Auth-service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'], // Corrected styleUrl to styleUrls
})
export class ChangePasswordComponent {
  showPassword: boolean = false;
  showPassword1: boolean = false;
  changePasswordObj: ChangePassword;

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {
    this.changePasswordObj = new ChangePassword();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordVisibility1(): void {
    this.showPassword1 = !this.showPassword1;
  }

  /**
   * Update the user's password with SweetAlert for notifications
   */
  updatePassword(): void {
    const userId = localStorage.getItem('userId:'); // Example: fetch the userId from localStorage
    console.log(userId);
    

    if (!userId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'User ID is not available. Please log in again.',
      });
      return;
    }

    if (!this.changePasswordObj.password || this.changePasswordObj.password.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Password cannot be empty.',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update your password?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.changePassword(userId, this.changePasswordObj.password).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Password updated successfully!',
            }).then(() => {
              this.router.navigate(['/login']); // Navigate to the login page after updating the password
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to update password. Please try again.',
            });
            console.log(error);
            
          }
        );
      }
    });
  }
}

export class ChangePassword {
  password: string;

  constructor() {
    this.password = '';
  }
}

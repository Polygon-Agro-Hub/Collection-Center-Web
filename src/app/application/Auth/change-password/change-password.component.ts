import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/Auth-service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'], // Corrected styleUrl to styleUrls
})
export class ChangePasswordComponent implements OnInit {
  showPassword: boolean = false;
  showPassword1: boolean = false;
  changePassword: string = '';
  conformPassword: string = '';

  isLoading: boolean = false;

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {
  }
  ngOnInit(): void {
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordVisibility1(): void {
    this.showPassword1 = !this.showPassword1;
  }

  updatePassword(): void {
    if (!this.changePassword || !this.conformPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Password cannot be empty.',
      });
      return;
    }

    if (this.changePassword !== this.conformPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'New Password and Conform Password does not match!',
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
        this.isLoading = true;
        this.authService.changePassword(this.changePassword).subscribe(
          (response) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Password updated successfully!',
            }).then(() => {
              this.router.navigate(['/login']); // Navigate to the login page after updating the password
            });
          },
          (error) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to update password. Please try again.',
            });
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

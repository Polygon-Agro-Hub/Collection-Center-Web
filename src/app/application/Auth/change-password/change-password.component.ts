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
  passwordTouched: boolean = false;
  confirmTouched: boolean = false;

  passwordRules = {
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecial: false,
  };

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void { }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordVisibility1(): void {
    this.showPassword1 = !this.showPassword1;
  }

  onPasswordChange(): void {
    this.changePassword = this.changePassword.trimStart();
    const p = this.changePassword;
    this.passwordRules.minLength = p.length >= 6;
    this.passwordRules.hasUppercase = /[A-Z]/.test(p);
    this.passwordRules.hasNumber = /[0-9]/.test(p);
    this.passwordRules.hasSpecial = /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?`~]/.test(p);
  }

  onConfirmPasswordChange(): void {
    this.conformPassword = this.conformPassword.trimStart();
  }

  get passwordValid(): boolean {
    return this.passwordRules.minLength && this.passwordRules.hasUppercase
      && this.passwordRules.hasNumber && this.passwordRules.hasSpecial;
  }

  get passwordErrorMessage(): string {
    if (!this.passwordRules.minLength) return 'Password must be at least 6 characters.';
    if (!this.passwordRules.hasUppercase) return 'Add at least 1 uppercase letter.';
    if (!this.passwordRules.hasNumber) return 'Add at least 1 number.';
    if (!this.passwordRules.hasSpecial) return 'Add at least 1 special character (!@#$%^&* etc).';
    return '';
  }

  get passwordsMatch(): boolean {
    return this.changePassword === this.conformPassword;
  }

  updatePassword(): void {
    this.passwordTouched = true;
    this.confirmTouched = true;

    if (!this.changePassword || !this.conformPassword || !this.passwordValid || !this.passwordsMatch) {
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

            if (!response.status) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.message || 'Failed to update password. Please try again.',
              });
              return;
            }

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
              text: error?.error?.message || 'Failed to update password. Please try again.',
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

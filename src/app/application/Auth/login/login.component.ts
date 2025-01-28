import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/Auth-service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  showPassword: boolean = false;
  loginObj: Login;
  disError: any;


  constructor(private authService: AuthService, private http: HttpClient, private router: Router){
    this.loginObj = new Login();
}

ngOnInit() {
  localStorage.removeItem('Login Token:');
}



onLogin(){
  console.log("Successfully click the button");

  if (!this.loginObj.userName) {
    Swal.fire({
      icon: 'error',
      title: 'Unsuccessful',
      text: 'User Name is required',
    });
  } 

  if(!this.loginObj.password){
    Swal.fire({
      icon: 'error',
      title: 'Unsuccessful',
      text: 'Password is required',
    });

  }

  if(!this.loginObj.userName && !this.loginObj.password){
    Swal.fire({
      icon: 'error',
      title: 'Unsuccessful',
      text: 'User Name and Password is required',
    });

  }

  if(this.loginObj.password && this.loginObj.userName){
    this.authService.login(this.loginObj.userName, this.loginObj.password).subscribe(

      (res: any) => {
        
        
        Swal.fire({
          icon: 'success',
          title: 'Logged',
          text: 'Successfully Logged In',
          showConfirmButton: false,
          timer: 1500
        });
        localStorage.setItem('Login Token:', res.token);
  
        localStorage.setItem('userName:', res.userName);
        localStorage.setItem('userId:', res.userId);
        localStorage.setItem('role:', res.role);
        localStorage.setItem('updatedPassword:', res.updatedPassword);
          localStorage.setItem('Token Expiration', String(new Date().getTime() + (res.expiresIn * 20)));
          // console.log("hi..",res.token);
          // console.log("hi..",res.userName);
          // console.log("hi..",res.role);
          // console.log("hi..",res.userId);
         
          if(res.updatedPassword==0){
            this.router.navigate(['/change-password']);
          }else if(res.updatedPassword==1){
            this.router.navigate(['/dashbord']);
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Unsuccessful',
              text: 'Error Occur. Please contact Agro World Admin',
            });
          }

          
        
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


export class Login{
  userName: string;
  password: string;
  
  constructor(){
    this.userName='';
    this.password='';
  }

}


import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenServiceService {
  private readonly TOKEN_KEY = 'CCLoginToken';
  private readonly USERNAME_KEY = 'CCuserName:';
  private readonly USERID_KEY = 'CCuserId:';
  private readonly ROLE_KEY = 'CCrole:';
  private readonly PROFILE_IMAGE = 'CCprofileImage';
  private readonly EXPIRATION_KEY = 'CCTokenExpiration';



  constructor() { }

  saveLoginDetails(token: string, userName: string, userId: string, role: string, expiresIn: number, image: string): Promise<void> {
    return new Promise((resolve) => {
      const expirationTime = new Date().getTime() + expiresIn * 1000; // Convert seconds to milliseconds
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USERNAME_KEY, userName);
      localStorage.setItem(this.USERID_KEY, userId);
      localStorage.setItem(this.ROLE_KEY, role);
      localStorage.setItem(this.PROFILE_IMAGE, image);
      localStorage.setItem(this.EXPIRATION_KEY, expirationTime.toString());
      resolve(); // Ensure function completes before continuing
    });

  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearLoginDetails(): Promise<void> {
    return new Promise((resolve) => {
      console.log("start");
      
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USERNAME_KEY);
      localStorage.removeItem(this.USERID_KEY);
      localStorage.removeItem(this.ROLE_KEY);
      localStorage.removeItem(this.EXPIRATION_KEY);
      console.log("end");

      resolve();
    })
  }


  isTokenExpired(): boolean {
    const expiration = localStorage.getItem(this.EXPIRATION_KEY);
    if (!expiration) {
      return true;
    }
    return new Date().getTime() > parseInt(expiration, 10);
  }

  getUserDetails(): any {
    return {
      userName: localStorage.getItem(this.USERNAME_KEY),
      userId: localStorage.getItem(this.USERID_KEY),
      role: localStorage.getItem(this.ROLE_KEY),
      image: localStorage.getItem(this.PROFILE_IMAGE),
      tokenExpiration: localStorage.getItem(this.EXPIRATION_KEY),

    };
  }
}


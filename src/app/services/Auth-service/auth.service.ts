import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.API_BASE_URL}`;


  constructor(private http: HttpClient) { }


  login(userName: string, password: string): Observable<any> {
    const loginObj = { userName, password };
    return this.http.post<any>(`${this.apiUrl}/auth/login`, loginObj);
  }

  changePassword(userId: string, password: string): Observable<any> {
    const changePasswordObj = {password};
    return this.http.post<any>(`${this.apiUrl}/auth/change-passwords/${userId}`, changePasswordObj);
  }  
}

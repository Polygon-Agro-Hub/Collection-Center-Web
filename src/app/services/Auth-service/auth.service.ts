import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenServiceService } from '../Token/token-service.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.API_BASE_URL}`;
  private token!: string | null;
  constructor(private http: HttpClient, private tokenSrv: TokenServiceService) {
    this.token = this.tokenSrv.getToken()
  }

  login(userName: string, password: string): Observable<any> {
    const loginObj = { userName, password };
    return this.http.post<any>(`${this.apiUrl}/auth/login`, loginObj);
  }

  changePassword(password: string): Observable<any> {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenSrv.getToken()}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.apiUrl}/auth/change-passwords`, { password }, {
      headers,
    });
  }

  getLoggedInUser(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenSrv.getToken()}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/auth/get-profile`, { headers });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenServiceService } from '../Token/token-service.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;
  private token!: string | null;

  constructor(
    private http: HttpClient, 
    private tokenSrv: TokenServiceService,
    private config: ConfigService
  ) {
    this.token = this.tokenSrv.getToken();
    this.apiUrl = this.config.getAuthUrl();
  }

  login(userName: string, password: string): Observable<any> {
    const loginObj = { userName, password };
    return this.http.post<any>(`${this.apiUrl}/login`, loginObj);
  }

  changePassword(password: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.apiUrl}/change-passwords`, { password }, {
      headers,
    });
  }

  getLoggedInUser(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-profile`, { headers });
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.API_BASE_URL}`;
  private token = `${environment.TOKEN}`;



  constructor(private http: HttpClient) { }


  login(userName: string, password: string): Observable<any> {
    const loginObj = { userName, password };
    return this.http.post<any>(`${this.apiUrl}/auth/login`, loginObj);
  }

  changePassword(password: string): Observable<any> {
    console.log(password);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.apiUrl}/auth/change-passwords`, { password }, {
      headers,
    });
  }
}

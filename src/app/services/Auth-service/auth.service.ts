import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.API_BASE_URL}login`;


  constructor(private http: HttpClient) { }

  // login(email: string, password: string): Observable<any> {
  //   const loginObj = { email, password };
  //   return this.http.post<any>(this.apiUrl, loginObj);
  // }
}

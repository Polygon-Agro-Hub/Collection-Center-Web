import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.API_BASE_URL}/dashboard`;
  private token = `${environment.TOKEN}`;

  constructor(private http: HttpClient) {}

  getOfficerCounts(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get<any>(`${this.apiUrl}/get-officer-counts`, {
      headers,
    });
  }

  getActivityLogs(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get<any[]>(`${this.apiUrl}/get-activity`, {
      headers,
    });
  }

  getChartData(endpoint: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    // Pass the dynamic endpoint into the URL
    return this.http.get<any[]>(`${this.apiUrl}/get-chart?filter=${endpoint}`, {
      headers,
    });
  }
  
}





import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenServiceService } from '../Token/token-service.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl: string;
  private token!: string | null;

  constructor(
    private http: HttpClient, 
    private tokenSrv: TokenServiceService,
    private config: ConfigService
  ) {
    this.token = this.tokenSrv.getToken();
    this.apiUrl = `${this.config.getApiUrl()}/dashboard`;
  }

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

  getChartData(filter: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get<any[]>(`${this.apiUrl}/get-chart?filter=${filter}`, {
      headers,
    });
  }
}

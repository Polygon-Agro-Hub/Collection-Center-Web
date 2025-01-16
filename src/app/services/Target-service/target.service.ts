import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TargetService {
  private apiUrl = `${environment.API_BASE_URL}/target`;
  private token = `${environment.TOKEN}`;

  constructor(private http: HttpClient) { }

  getCropVerity(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-crop-category`;
    return this.http.get<any>(url, { headers });
  }

  createDailyTarget(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/create-daily-target`;
    return this.http.post<any>(url, data, { headers });
  }

  getAllDailyTarget(page: number = 1, limit: number = 10, searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-daily-target?page=${page}&limit=${limit}`;

    if (searchText) {
      url += `&searchText=${searchText}`
    }

    return this.http.get<any>(url, { headers });
  }

  downloadDailyTarget(fromDate: Date | string, toDate: Date | string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/download-daily-target?fromDate=${fromDate}&toDate=${toDate}`;



    return this.http.get<any>(url, { headers });
  }
}

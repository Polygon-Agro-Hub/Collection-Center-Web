import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsService {
  private apiUrl = `${environment.API_BASE_URL}`;
  private token = `${environment.TOKEN}`;



  constructor(private http: HttpClient) { }

  // downloadDailyTarget(fromDate: Date | string, toDate: Date | string): Observable<any> {
  //     const headers = new HttpHeaders({
  //       Authorization: `Bearer ${this.token}`
  //     });

  //     let url = `${this.apiUrl}/download-daily-target?fromDate=${fromDate}&toDate=${toDate}`;
  //     return this.http.get<any>(url, { headers });
  //   }
}

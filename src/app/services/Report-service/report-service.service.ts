import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {
  private apiUrl = `${environment.API_BASE_URL}/report`;
  private token = `${environment.TOKEN}`;


  constructor(private http: HttpClient) { }

  getAllCollectionReport(page: number = 1, limit: number = 10, searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-collection-reports-details?page=${page}&limit=${limit}`

    if (searchText) {
      url += `&searchText=${searchText}`
    }

    return this.http.get(url, {
      headers,
    });
  }

  getAllSalesReport(page: number = 1, limit: number = 10, searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-sales-reports-details?page=${page}&limit=${limit}`

    if (searchText) {
      url += `&searchText=${searchText}`
    }

    return this.http.get(url, {
      headers,
    });
  }


  getCollectionFarmerList(id: number, page: number = 1, limit: number = 10, searchText: string = '', date: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-collection-farmer-list/${id}?page=${page}&limit=${limit}`

    if (searchText) {
      url += `&searchText=${searchText}`
    }

    if(date){
      url += `&date=${date}`
    }

    return this.http.get(url, {
      headers,
    });
  }

  getCollectionDailyReport(id:number, date:string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-daily-report/${id}/${date}`

    return this.http.get(url, {
      headers,
    });
  }
}







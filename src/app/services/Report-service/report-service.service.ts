import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenServiceService } from '../Token/token-service.service';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {
  private apiUrl = `${environment.API_BASE_URL}/report`;
  // private token = `${environment.TOKEN}`;

  private token!: string | null;

  constructor(private http: HttpClient, private tokenSrv: TokenServiceService) {
    this.token = this.tokenSrv.getToken()
  }

  getAllCollectionReport(role:string, page: number = 1, limit: number = 10, searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-collection-reports-details?page=${page}&limit=${limit}&role=${role}`

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

    if (date) {
      url += `&date=${date}`
    }

    return this.http.get(url, {
      headers,
    });
  }

  getCollectionDailyReport(id: number, date: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-daily-report/${id}/${date}`

    return this.http.get(url, {
      headers,
    });
  }


  getCollectionmonthlyReportOfficerData(id: number, startDate: Date, endDate: Date): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-monthly-officer-details/${id}/${startDate}/${endDate}`

    return this.http.get(url, {
      headers,
    });
  }

  getFarmerReport(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-farmer-report-details/${id}`

    return this.http.get(url, {
      headers,
    });
  }

  getAllPayments(
    page: number = 1, 
    limit: number = 10, 
    searchText: string = '', 
    selectcenter: string = '', 
    date: string = ''
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
  
    let url = `${this.apiUrl}/get-all-payments?page=${page}&limit=${limit}`;
  
    if (searchText) {
      url += `&searchText=${searchText}`;
    }
  
    if (selectcenter) {
      url += `&center=${selectcenter}`;
    }
  
    if (date) {
      // Check if date is in YYYY-MM format (month filter)
      if (/^\d{4}-\d{2}$/.test(date)) {
        url += `&month=${date}`;
      } 
      // Else it's in YYYY-MM-DD format (date filter)
      else {
        url += `&date=${date}`;
      }
    }
  
    return this.http.get(url, { headers });
  }

}


// if (status) {
    //   url += `&status=${status}`
    // }

    // if (role) {
    //   url += `&role=${role}`
    // }
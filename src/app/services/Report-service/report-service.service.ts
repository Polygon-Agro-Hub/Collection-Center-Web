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
  private token!: string | null;

  constructor(private http: HttpClient, private tokenSrv: TokenServiceService) {
    this.token = this.tokenSrv.getToken()
  }

  getAllCollectionReport(role: string, page: number = 1, limit: number = 10, searchText: string = '', centerId:string=''): Observable<any> {
    console.log('this is seacrch', searchText)
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-collection-reports-details?page=${page}&limit=${limit}&role=${role}`

    if (searchText) {
      url += `&searchText=${searchText}`
    }

    if(centerId) {
      url += `&center=${centerId}`
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


  getCollectionFarmerList(id: number, page: number = 1, limit: number = 10, searchText: string = '', date: string | Date | null = ''): Observable<any> {
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

  getCollectionDailyReport(id: number, date: string | Date | null): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-daily-report/${id}/${date}`

    return this.http.get(url, {
      headers,
    });
  }


  getCollectionmonthlyReportOfficerData(id: number, startDate: Date | null, endDate: Date | null): Observable<any> {
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
    fromDate: Date | string = '',
    toDate: Date | string = '',
    center: string = '',
    searchText: string = ''
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    console.log('to', toDate, 'from', fromDate, 'saerch', searchText);
    // Base URL with date range
    let url = `${this.apiUrl}/get-all-payments?page=${page}&limit=${limit}&fromDate=${fromDate}&toDate=${toDate}`;

    // Add filters only if available
    if (center) {
      url += `&center=${center}`;
    }

    if (searchText) {
      url += `&searchText=${searchText}`;
    }

    return this.http.get(url, { headers });
  }

  downloadPaymentReportFile(
    fromDate: Date | string,
    toDate: Date | string,
    center: string = '',
    searchText: string = ''
  ): Observable<Blob> {
    let url = `${this.apiUrl}/download-payment-report?fromDate=${fromDate}&toDate=${toDate}`;

    if (center) {
      url += `&center=${center}`;
    }

    if (searchText) {
      url += `&searchText=${searchText}`;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      // Optional: 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    return this.http.get(url, { headers, responseType: 'blob' });
  }





  getAllCollections(
    page: number = 1,
    limit: number = 10,
    fromDate: Date | string = '',
    toDate: Date | string = '',
    center: string = '',
    searchText: string = ''
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-all-collection?page=${page}&limit=${limit}&fromDate=${fromDate}&toDate=${toDate}`;
    if (center) {
      url += `&center=${center}`;
    }

    if (searchText) {
      url += `&searchText=${searchText}`;
    }

    return this.http.get(url, { headers });
  }

  downloadCollectionReportFile(
    fromDate: Date | string,
    toDate: Date | string,
    center: string = '',
    searchText: string = ''
  ): Observable<Blob> {
    let url = `${this.apiUrl}/download-collection-report?fromDate=${fromDate}&toDate=${toDate}`;

    if (center) {
      url += `&center=${center}`;
    }

    if (searchText) {
      url += `&searchText=${searchText}`;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      // Optional: 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    return this.http.get(url, { headers, responseType: 'blob' });
  }

  getAllCenterPayments(
    page: number = 1,
    limit: number = 10,
    fromDate: Date | string = '',
    toDate: Date | string = '',
    centerId: number,
    searchText: string = ''
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    // Base URL with date range
    let url = `${this.apiUrl}/get-all-center-payments?page=${page}&limit=${limit}&fromDate=${fromDate}&toDate=${toDate}&centerId=${centerId}`;

    if (searchText) {
      url += `&searchText=${searchText}`;
    }

    return this.http.get(url, { headers });
  }

  downloadCenterPaymentReportFile(
    fromDate: Date | string,
    toDate: Date | string,
    centerId: number,
    searchText: string = ''
  ): Observable<Blob> {
    let url = `${this.apiUrl}/download-center-payment-report?fromDate=${fromDate}&toDate=${toDate}&centerId=${centerId}`;


    if (searchText) {
      url += `&searchText=${searchText}`;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get(url, { headers, responseType: 'blob' });
  }

  getFarmerReportInvoice(invNo: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-farmer-report-invoice-details/${invNo}`

    return this.http.get(url, {
      headers,
    });
  }

}


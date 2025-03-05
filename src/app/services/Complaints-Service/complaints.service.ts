import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenServiceService } from '../Token/token-service.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsService {
  private apiUrl: string;
  private token!: string | null;

  constructor(
    private http: HttpClient, 
    private tokenSrv: TokenServiceService,
    private config: ConfigService
  ) {
    this.token = this.tokenSrv.getToken();
    this.apiUrl = `${this.config.getApiUrl()}/complaint`;
  }

  getAllReciveComplaints(page: number = 1, limit: number = 10, status: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-recived-complaints?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }

    if (searchText) {
      url += `&searchText=${searchText}`;
    }

    return this.http.get<any>(url, { headers });
  }

  getComplainById(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-recived-complaints-by-id/${id}`;
    return this.http.get<any>(url, { headers });
  }

  forwordComplain(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/forword-to-complain/${id}`;
    return this.http.patch<any>(url,{}, { headers });
  }

  replyToComplain(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/reply-complain`;
    return this.http.patch<any>(url, data, { headers });
  }

  getAllSentComplains(page: number = 1, limit: number = 10, status: string = '', emptype: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-all-sent-complaint?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }

    if (emptype) {
      url += `&emptype=${emptype}`;
    }

    if (searchText) {
      url += `&searchText=${searchText}`;
    }

    return this.http.get<any>(url, { headers });
  }

  submitComplaint(data: { category: string; complaint: string }): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/add-complain`;
    return this.http.post<any>(url, data, { headers });
  }

  getAllCCHReciveComplaints(page: number = 1, limit: number = 10, status: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-recived-cch-complaints?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }

    if (searchText) {
      url += `&searchText=${searchText}`;
    }

    return this.http.get<any>(url, { headers });
  }

  getAllSentCCHComplains(page: number = 1, limit: number = 10, status: string = '', emptype: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-all-sent-cch-complaint?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }

    if (emptype) {
      url += `&emptype=${emptype}`;
    }

    if (searchText) {
      url += `&searchText=${searchText}`;
    }

    return this.http.get<any>(url, { headers });
  }

  forwordCCHComplain(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/forword-complain-admin/${id}`;
    return this.http.patch<any>(url,{}, { headers });
  }

  submitCCHComplaint(data: { category: string; complaint: string }): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/add-complain-cch`;
    return this.http.post<any>(url, data, { headers });
  }
}

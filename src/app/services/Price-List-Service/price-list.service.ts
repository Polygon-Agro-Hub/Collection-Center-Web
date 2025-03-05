import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenServiceService } from '../Token/token-service.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {
  private apiUrl: string;
  private token!: string | null;

  constructor(
    private http: HttpClient, 
    private tokenSrv: TokenServiceService,
    private config: ConfigService
  ) {
    this.token = this.tokenSrv.getToken();
    this.apiUrl = `${this.config.getApiUrl()}/price-list`;
  }

  getAllPriceList(page: number = 1, limit: number = 10, grade: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/view-all-price?page=${page}&limit=${limit}`;

    if (grade) {
      url += `&grade=${grade}`;
    }

    if (searchText) {
      url += `&searchText=${searchText}`;
    }

    return this.http.get(url, {
      headers,
    });
  }

  updatePrice(id: number, value: number): Observable<any> {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.patch(`${this.apiUrl}/update-price/${id}`, { value }, {
      headers,
    });
  }

  getAllRequestPrice(page: number = 1, limit: number = 10, grade: string = '', status: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-all-price-request?page=${page}&limit=${limit}`


    if (grade) {
      url += `&grade=${grade}`
    }

    if (status) {
      url += `&status=${status}`
    }

    if (searchText) {
      url += `&searchText=${searchText}`
    }

    return this.http.get(url, {
      headers,
    });
  }

  ChangeRequestStatus(id: number, status: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.patch(`${this.apiUrl}/change-request-status/${id}`, { status }, {
      headers,
    });
  }
}

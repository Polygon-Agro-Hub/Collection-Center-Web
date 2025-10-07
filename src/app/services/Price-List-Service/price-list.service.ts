import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenServiceService } from '../Token/token-service.service';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {
  private apiUrl = `${environment.API_BASE_URL}/price-list`;
  private token!: string | null;

  constructor(private http: HttpClient, private tokenSrv: TokenServiceService) {
    this.token = this.tokenSrv.getToken()
  }

  getAllPriceList(page: number = 1, limit: number = 10, grade: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/view-all-price?page=${page}&limit=${limit}`

    if (grade) {
      url += `&grade=${grade}`
    }

    if (searchText) {
      url += `&searchText=${searchText}`
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
    console.log('grade', grade, 'status', status, 'search', searchText)
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

  forwardRequest(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.patch(`${this.apiUrl}/forward-request/${id}`, {}, {
      headers,
    });
  }

  getCropGroup(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-all-crop-group`

    return this.http.get(url, {
      headers,
    });
  }

  getCropVariety(cropGroupId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-all-crop-variety/${cropGroupId}`

    return this.http.get(url, {
      headers,
    });
  }

  getCurrentPrice(cropGroupId: number, cropVarietyId: number, grade: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    const url = `${this.apiUrl}/get-current-price/${cropGroupId}/${cropVarietyId}/${grade}`;

    return this.http.get(url, {
      headers,
    });
  }


  


}

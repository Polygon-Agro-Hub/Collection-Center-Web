import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenServiceService } from '../Token/token-service.service';

@Injectable({
  providedIn: 'root'
})
export class DistributionServiceService {

  private apiUrl = `${environment.API_BASE_URL}/distribution`;
  private token!: string | null;

  constructor(private http: HttpClient, private tokenSrv: TokenServiceService) {
    this.token = this.tokenSrv.getToken()
  }

  getDistributionCenterDetails(page: number = 1, limit: number = 10, province: string = '', district: string = '', search: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-all-distribution-centers?page=${page}&limit=${limit}`;

    if (province) {
      url += `&province=${province}`;
    }

    if (district) {
      url += `&district=${district}`;
    }

    if (search) {
      url += `&searchText=${search}`;
    }

    return this.http.get(url, { headers });
  }


  createDistributionCenter(centerData: any): Observable<any> {
    const formData = new FormData();
    formData.append('centerData', JSON.stringify(centerData));

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.post(`${this.apiUrl}/create-distribution-center`, formData, {
      headers,
    });
  }

  getAllCenterOfficersForDCH(page: number = 1, limit: number = 10, centerId: number, status: string = '', role: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-all-center-officers-for-dch?page=${page}&limit=${limit}&centerId=${centerId}`

    if (status) {
      url += `&status=${status}`
    }
    if (role) {
      url += `&role=${role}`
    }

    if (searchText) {
      url += `&searchText=${searchText}`
    }
    return this.http.get(url, {
      headers,
    });
  }

  // getDistributionCenterOfficers(centerData: any): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('centerData', JSON.stringify(centerData));

  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.token}`,
  //   });
  //   return this.http.post(`${this.apiUrl}/create-distribution-center`, formData, {
  //     headers,
  //   });
  // }

  getDistributionCenterOfficers(): Observable<any> {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-distribution-center-officers`, {
      headers,
    });
  }

  getDistributionOrders(): Observable<any> {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-distribution-orders`, {
      headers,
    });
  }

  assignOrdersToCenterOfficers(
    assignmentPayload: { officerId: number; count: number }[],
    orderIdList: number[]
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
  
    const url = `${this.apiUrl}/assign-orders-to-center-officers`;
  
    // Construct the payload
    const data = {
      assignments: assignmentPayload,
      processOrderIds: orderIdList
    };

    console.log('data', data)
  
    return this.http.post<any>(url, data, { headers });
  }

  getAllRequests(page: number = 1, limit: number = 10, date: string = '', status: string = '', searchText: string = ''): Observable<any> {
    console.log('date', date, 'status', status, 'search', searchText)
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-all-request?page=${page}&limit=${limit}`

    if (date) {
      url += `&date=${date}`
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

  approveRequest(requestObj: any): Observable<any> {
    console.log()
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/approve-request`

    return this.http.post(url, requestObj, { headers });
  }

  rejectRequest(requestObj: any): Observable<any> {
    console.log()
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/reject-request`

    return this.http.post(url, requestObj, { headers });
  }
  
}



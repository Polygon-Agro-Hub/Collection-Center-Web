import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenServiceService } from '../Token/token-service.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DistributedManageOfficersService {

  private apiUrl = `${environment.API_BASE_URL}/distributed`;
  private token!: string | null;

  constructor(private http: HttpClient, private tokenSrv: TokenServiceService) {
    this.token = this.tokenSrv.getToken()
  }

  getAllOfficers(page: number = 1, limit: number = 10, status: string = '', role: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/manage-officers/get-all-officers?page=${page}&limit=${limit}`

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

  getAllOfficersForDCH(page: number = 1, limit: number = 10, status: string = '', role: string = '', searchText: string = '', selectcenter: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/manage-officers/get-all-officers-for-dch?page=${page}&limit=${limit}`

    if (status) {
      url += `&status=${status}`
    }

    if (selectcenter) {
      url += `&center=${selectcenter}`
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

  getCompanyNames(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/manage-officers/get-all-company-names`;
    return this.http.get<any>(url, { headers });
  }

  deleteOfficer(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/manage-officers/delete-officer/${id}`;
    return this.http.delete<any>(url, { headers });
  }

  ChangeStatus(id: number, status: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/manage-officers/update-status/${id}/${status}`;
    return this.http.get<any>(url, { headers });
  }

  getDCHOwnCenters(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.apiUrl}/manage-officers/get-centers-dch-own`, {
      headers,
    });
  }


}

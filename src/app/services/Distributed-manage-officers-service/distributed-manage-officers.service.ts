import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { TokenServiceService } from '../Token/token-service.service';
import { environment } from '../../environments/environment';

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

  getDistributionCenterManagers(id: number | string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/manage-officers/get-distribution-center-managers/${id}`, {
      headers,
    });
  }

  getDistributionCenterManagersEdit(id: number | string, officerId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/manage-officers/get-distribution-center-managers-edit/${id}/${officerId}`, {
      headers,
    });
  }

  getForCreateId(role: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.apiUrl}/manage-officers/get-last-emp-id/${role}`, {
      headers,
    });
  }

  createDistributionOfficer(person: any, driver: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    const body: any = { officerData: person };
    if (person.jobRole === 'Driver') {
      body.driverData = driver;
    }

    return this.http.post(`${this.apiUrl}/manage-officers/create-officer`, body, {
      headers,
    });
  }

  createDistributionOfficerDIO(person: any, driver: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    const body: any = { officerData: person };
    if (person.jobRole === 'Driver') {
      body.driverData = driver;
    }

    return this.http.post(`${this.apiUrl}/manage-officers/create-officer-dio`, body, {
      headers,
    });
  }

  getOfficerById(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get(`${this.apiUrl}/manage-officers/get-officer-by-id/${id}`, {
      headers,
    });
  }

  updateDistributionOfficer(person: any, id: number, driver: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    const body: any = { officerData: person };
    if (person.jobRole === 'Driver') {
      body.driverData = driver;
    }

    return this.http.put(`${this.apiUrl}/manage-officers/update-officer/${id}`, body, {
      headers,
    });
  }

  updateDistributionOfficerDIO(person: any, id: number, driver: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    const body: any = { officerData: person };
    if (person.jobRole === 'Driver') {
      body.driverData = driver;
    }

    return this.http.put(`${this.apiUrl}/manage-officers/update-officer-dio/${id}`, body, {
      headers,
    });
  }

  /**
   * Uploads a single officer image to the backend, which forwards it to R2
   * and returns the resulting public URL. `type` must match one of the
   * backend's IMAGE_TYPE_PREFIXES keys (e.g. 'profile', 'licFront', 'vehSideB').
   */
  uploadOfficerImage(file: File, type: string): Observable<{ status: boolean; url: string }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.http.post<{ status: boolean; url: string }>(`${this.apiUrl}/manage-officers/upload-image`, formData, {
      headers,
    });
  }

  /**
   * Checks NIC/email/phone duplicates before any images are uploaded.
   * Pass `id` for an edit (excludes the officer's own row); omit it for create.
   */
  checkDuplicateOfficer(person: any, id?: number): Observable<{ status: boolean; errors?: string[] }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    const body: any = {
      nic: person.nic,
      email: person.email,
      phoneNumber01: person.phoneNumber01,
      phoneNumber02: person.phoneNumber02,
    };
    if (id) {
      body.id = id;
    }

    return this.http.post<{ status: boolean; errors?: string[] }>(`${this.apiUrl}/manage-officers/check-duplicate`, body, {
      headers,
    });
  }

  ResetPassword(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/manage-officers/reset-password/${id}`;
    return this.http.get<any>(url, { headers });
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
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

  getDistributionCenterManagers(id: number | string): Observable<any> {
    console.log('id', id)
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/manage-officers/get-distribution-center-managers/${id}`, {
      headers,
    });
  }

  getDistributionCenterManagersEdit(id: number | string, officerId: number): Observable<any> {
    console.log('id', id)
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

  createDistributionOfficer(person: any, selectedFile: File | null, driver: any, licFront: any, licBack: any, insFront: any, insBack: any, vehiFront: any, vehiBack: any, vehiSideA: any, vehiSideB: any): Observable<any> {
    console.log('person', person)
    console.log('file', selectedFile)
    const formData = new FormData();

    if (person.jobRole === 'Driver') {
      formData.append('driverData', JSON.stringify(driver));
      formData.append('licFront', licFront);
      formData.append('licBack', licBack);
      formData.append('insFront', insFront);
      formData.append('insBack', insBack);
      formData.append('vehiFront', vehiFront);
      formData.append('vehiBack', vehiBack);
      formData.append('vehiSideA', vehiSideA);
      formData.append('vehiSideB', vehiSideB);
    }
    
    formData.append('officerData', JSON.stringify(person));
    if (selectedFile) {
      formData.append('file', selectedFile); 
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.post(`${this.apiUrl}/manage-officers/create-officer`, formData, {
      headers,
    });
  }

  createDistributionOfficerDIO(person: any, selectedFile: File | null, driver: any, licFront: any, licBack: any, insFront: any, insBack: any, vehiFront: any, vehiBack: any, vehiSideA: any, vehiSideB: any): Observable<any> {
    console.log('person', person)
    console.log('selectedFile', selectedFile)
    const formData = new FormData();

    if (person.jobRole === 'Driver') {
      formData.append('driverData', JSON.stringify(driver));
      formData.append('licFront', licFront);
      formData.append('licBack', licBack);
      formData.append('insFront', insFront);
      formData.append('insBack', insBack);
      formData.append('vehiFront', vehiFront);
      formData.append('vehiBack', vehiBack);
      formData.append('vehiSideA', vehiSideA);
      formData.append('vehiSideB', vehiSideB);
    }
    
    formData.append('officerData', JSON.stringify(person));
    if (selectedFile) {
      formData.append('file', selectedFile); 
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.post(`${this.apiUrl}/manage-officers/create-officer-dio`, formData, {
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

  updateDistributionOfficer(person: any, id: number, selectedFile: File | null, driver: any, licFront: any, licBack: any, insFront: any, insBack: any, vehiFront: any, vehiBack: any, vehiSideA: any, vehiSideB: any): Observable<any> {
    const formData = new FormData();

    if (person.jobRole === 'Driver') {
      formData.append('driverData', JSON.stringify(driver));
      formData.append('licFront', licFront);
      formData.append('licBack', licBack);
      formData.append('insFront', insFront);
      formData.append('insBack', insBack);
      formData.append('vehiFront', vehiFront);
      formData.append('vehiBack', vehiBack);
      formData.append('vehiSideA', vehiSideA);
      formData.append('vehiSideB', vehiSideB);
    }

    formData.append('officerData', JSON.stringify(person));
    if (selectedFile) {
      formData.append('file', selectedFile); 
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.put(`${this.apiUrl}/manage-officers/update-officer/${id}`, formData, {
      headers,
    });
  }

  updateDistributionOfficerDIO(person: any, id: number, selectedFile: File | null, driver: any, licFront: any, licBack: any, insFront: any, insBack: any, vehiFront: any, vehiBack: any, vehiSideA: any, vehiSideB: any): Observable<any> {
    const formData = new FormData();

    if (person.jobRole === 'Driver') {
      formData.append('driverData', JSON.stringify(driver));
      formData.append('licFront', licFront);
      formData.append('licBack', licBack);
      formData.append('insFront', insFront);
      formData.append('insBack', insBack);
      formData.append('vehiFront', vehiFront);
      formData.append('vehiBack', vehiBack);
      formData.append('vehiSideA', vehiSideA);
      formData.append('vehiSideB', vehiSideB);
    }
    
    formData.append('officerData', JSON.stringify(person));
    if (selectedFile) {
      formData.append('file', selectedFile); 
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.put(`${this.apiUrl}/manage-officers/update-officer-dio/${id}`, formData, {
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

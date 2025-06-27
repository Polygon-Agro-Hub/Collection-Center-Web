import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenServiceService } from '../Token/token-service.service';

@Injectable({
  providedIn: 'root'
})
export class TargetService {
  private apiUrl = `${environment.API_BASE_URL}/target`;
  private token!: string | null;

  constructor(private http: HttpClient, private tokenSrv: TokenServiceService) {
    this.token = this.tokenSrv.getToken()
  }

  getCropVerity(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-crop-category`;
    return this.http.get<any>(url, { headers });
  }

  getAllDailyTarget(page: number = 1, limit: number = 10, searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-daily-target`;

    if (searchText) {
      url += `?searchText=${searchText}`
    }

    return this.http.get<any>(url, { headers });
  }

  downloadDailyTarget(fromDate: Date | string, toDate: Date | string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/download-daily-target?fromDate=${fromDate}&toDate=${toDate}`;



    return this.http.get<any>(url, { headers });
  }

  getCenterDetails(page: number = 1, limit: number = 10, province: string = '', district: string = '', search: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-all-centers?page=${page}&limit=${limit}`;

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

  getDashbordDetails(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-center-dashboard/${id}`;
    return this.http.get<any>(url, { headers });
  }

  getOfficers(centerId: number, page: number = 1, limit: number = 10, role: string = '', status: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-all-officers?centerId=${centerId}&page=${page}&limit=${limit}`

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

  getAllPriceList(centerId: number, page: number = 1, limit: number = 10, grade: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-all-price?centerId=${centerId}&page=${page}&limit=${limit}`;

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

  AssignAllDailyTarget(page: number = 1, limit: number = 10, search: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/assign-all-daily-target?page=${page}&limit=${limit}`;

    if (search) {
      url += `&searchText=${search}`
    }

    return this.http.get<any>(url, { headers });
  }

  getTargetVerity(varietyId: number, companyCenterId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-target-verity/${varietyId}/${companyCenterId}`;

    return this.http.get<any>(url, { headers });
  }


  assignOfficerTartget(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/assing-officer-target`;

    return this.http.post<any>(url, data, { headers });
  }

  getOfficerTargetData(status: string = '', search: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-officer-target-data?limit=1`;

    if (status) {
      url += `&status=${status}`;
    }

    if (search) {
      url += `&search=${search}`
    }

    return this.http.get(url, {
      headers,
    });
  }

  getOfficerTartgetItem(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-officer-target-by-id/${id}`;

    return this.http.get<any>(url, { headers });
  }

  passToTargetToOfficer(id: number | null, targetItemId: number, amount: number): Observable<any> {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/pass-target-to-officer`;

    return this.http.patch<any>(url, { officerId: id, target: targetItemId, amount: amount }, { headers });
  }

  getSelectedOfficerTargetData(officerId: number, status: string = '', search: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-selected-officer-target-data?officerId=${officerId}`;

    if (status) {
      url += `&status=${status}`;
    }

    if (search) {
      url += `&search=${search}`
    }

    return this.http.get(url, {
      headers,
    });
  }

  createCenter(centerData: any): Observable<any> {
    const formData = new FormData();
    formData.append('centerData', JSON.stringify(centerData));

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.post(`${this.apiUrl}/create-center`, formData, {
      headers,
    });
  }


  getExistTargetVerity(varietyId: number, companyCenterId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-exist-veriety-target/${varietyId}/${companyCenterId}`;

    return this.http.get<any>(url, { headers });
  }


  editAssignedOfficerTartget(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/edit-assigned-officer-target`;

    return this.http.post<any>(url, data, { headers });
  }

  getAllCenterDailyTarget(centerId: number, page: number = 1, limit: number = 10, status: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-center-target?centerId=${centerId}&page=${page}&limit=${limit}`;

    if (status) {
      url += `&status=${status}`
    }

    if (searchText) {
      url += `&searchText=${searchText}`
    }

    return this.http.get<any>(url, { headers });
  }


  // new parts-----------------------
  getCenterCrops(id: number, page: number = 1, limit: number = 10, searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-center-crops/${id}?page=${page}&limit=${limit}`;
    if (searchText) {
      url += `&searchText=${searchText}`
    }

    return this.http.get<any>(url, { headers });
  }

  addORremoveCenterCrops(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/add-center-crops`;
    return this.http.post<any>(url, data, { headers });
  }

  getSavedCenterCrops(id: number, date: string, searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-saved-center-crops/${id}/${date}`;
    if (searchText) {
      url += `?searchText=${searchText}`
    }

    return this.http.get<any>(url, { headers });
  }

  updateTargetQty(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/update-target-crop-qty`;
    return this.http.patch<any>(url, data, { headers });
  }

  addNewCenterTarget(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/add-new-center-target`;
    return this.http.post<any>(url, data, { headers });
  }


  getOfficerAvailabeTarget(data: any, page: number = 1, limit: number = 10, status: string = '', validity: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    console.log('page', page, 'limit', limit)
    console.log('data', data);

    let url = `${this.apiUrl}/officer-target-check-available?page=${page}&limit=${limit}`;

    if (status) {
      url += `&status=${status}`
    }

    if (validity) {
      url += `&validity=${validity}`
    }

    if (searchText) {
      url += `&searchText=${searchText}`
    }

    return this.http.post<any>(url, data, { headers });
  }


  transferOfficerTargetToOfficer(id: number | null, targetItemId: number, amount: number): Observable<any> {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/transfer-officer-target-to-officer`;

    return this.http.patch<any>(url, { officerId: id, target: targetItemId, amount: amount }, { headers });
  }

  downloadOfficerTarget(
    fromDate: Date | string,
    toDate: Date | string,
    jobRole: string = '',
    empId: string = '',
    status: string = '',
    validity: string = '',
    searchText: string = '',

  ): Observable<Blob> {
    let url = `${this.apiUrl}/download-officer-target-report?fromDate=${fromDate}&toDate=${toDate}&jobRole=${jobRole}&empId=${empId}`;

    if (status) {
      url += `&status=${status}`
    }

    if (validity) {
      url += `&validity=${validity}`
    }

    if (searchText) {
      url += `&searchText=${searchText}`
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get(url, { headers, responseType: 'blob' });
  }

  downloadCurrentTargetReport(
    centerId: number,
    status: string = '',
    searchText: string = ''
  ): Observable<Blob> {
    let url = `${this.apiUrl}/download-current-target-report?centerId=${centerId}`;

    if (status) {
      url += `&status=${status}`;
    }

    if (searchText) {
      url += `&searchText=${searchText}`;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get(url, { headers, responseType: 'blob' });
  }

}


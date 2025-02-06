import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TargetService {
  private apiUrl = `${environment.API_BASE_URL}/target`;
  private token = `${environment.TOKEN}`;

  constructor(private http: HttpClient) { }

  getCropVerity(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-crop-category`;
    return this.http.get<any>(url, { headers });
  }

  createDailyTarget(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/create-daily-target`;
    return this.http.post<any>(url, data, { headers });
  }

  getAllDailyTarget(page: number = 1, limit: number = 10, searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-daily-target?page=${page}&limit=${limit}`;

    if (searchText) {
      url += `&searchText=${searchText}`
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

  getCenterDetails(province: string = '', district: string = '', search: string = '', page: number = 1, limit: number = 10): Observable<any> {
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

  AssignAllDailyTarget(page: number = 1, limit: number = 10): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/assign-all-daily-target?page=${page}&limit=${limit}`;

    return this.http.get<any>(url, { headers });
  }

  getTargetVerity(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-target-verity/${id}`;

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

    // If status is provided, append it as a query parameter.
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
    console.log(id, targetItemId, amount, "--dwdwd--");

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


}




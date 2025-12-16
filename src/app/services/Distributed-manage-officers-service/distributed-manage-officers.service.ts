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

  getForCreateId(role: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.apiUrl}/manage-officers/get-last-emp-id/${role}`, {
      headers,
    });
  }

  createDistributionOfficer(person: any, selectedImage: any, driver: any, licFront: any, licBack: any, insFront: any, insBack: any, vehiFront: any, vehiBack: any, vehiSideA: any, vehiSideB: any): Observable<any> {
    console.log('person', person)
    console.log('selectedImage', selectedImage)
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
    formData.append('file', selectedImage);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.post(`${this.apiUrl}/manage-officers/create-officer`, formData, {
      headers,
    });
  }

  createDistributionOfficerDIO(person: any, selectedImage: any, driver: any, licFront: any, licBack: any, insFront: any, insBack: any, vehiFront: any, vehiBack: any, vehiSideA: any, vehiSideB: any): Observable<any> {
    console.log('person', person)
    console.log('selectedImage', selectedImage)
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
    formData.append('file', selectedImage);
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

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
  
  updateDistributionOfficer(
    person: any,
    id: number,
    image: any,
    driver: any,
    licFront: any,
    licBack: any,
    insFront: any,
    insBack: any,
    vehiFront: any,
    vehiBack: any,
    vehiSideA: any,
    vehiSideB: any
  ): Observable<any> {
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  
    return from((async () => {
      const formData = new FormData();
  
      if (person.jobRole === 'Driver') {
        formData.append('driverData', JSON.stringify(driver));
  
        if (licFront) formData.append('licFront', await this.fileToBase64(licFront));
        if (licBack) formData.append('licBack', await this.fileToBase64(licBack));
        if (insFront) formData.append('insFront', await this.fileToBase64(insFront));
        if (insBack) formData.append('insBack', await this.fileToBase64(insBack));
        if (vehiFront) formData.append('vehiFront', await this.fileToBase64(vehiFront));
        if (vehiBack) formData.append('vehiBack', await this.fileToBase64(vehiBack));
        if (vehiSideA) formData.append('vehiSideA', await this.fileToBase64(vehiSideA));
        if (vehiSideB) formData.append('vehiSideB', await this.fileToBase64(vehiSideB));
      }
  
      formData.append('officerData', JSON.stringify(person));
      formData.append('file', image);
  
      return formData;
    })()).pipe(
      switchMap(formData =>
        this.http.put(
          `${this.apiUrl}/manage-officers/update-officer/${id}`,
          formData,
          { headers }
        )
      )
    );
  }

  updateDistributionOfficerDIO(person: any, id: number, image: any, driver: any, licFront: any, licBack: any, insFront: any, insBack: any, vehiFront: any, vehiBack: any, vehiSideA: any, vehiSideB: any): Observable<any> {
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
    formData.append('file', image);

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

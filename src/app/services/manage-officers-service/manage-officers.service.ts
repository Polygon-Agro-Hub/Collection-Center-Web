import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { TokenServiceService } from '../Token/token-service.service';

@Injectable({
  providedIn: 'root'
})
export class ManageOfficersService {
  private apiUrl = `${environment.API_BASE_URL}`;
  private token!: string | null;

  constructor(private http: HttpClient, private tokenSrv: TokenServiceService) {
    this.token = this.tokenSrv.getToken()
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

  getAllCollectionCenter(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.apiUrl}/manage-officers/get-all-center`, {
      headers,
    });
  }

  createCollectiveOfficer(person: any, selectedImage: any): Observable<any> {
    const formData = new FormData();
    formData.append('officerData', JSON.stringify(person));
    formData.append('file', selectedImage);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.post(`${this.apiUrl}/manage-officers/create-officer`, formData, {
      headers,
    });
  }


  getAllManagersByCenter(centerId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.apiUrl}/manage-officers/get-by-managerID/${centerId}`, {
      headers,
    });
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


  getOfficerById(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get(`${this.apiUrl}/manage-officers/get-officer-by-id/${id}`, {
      headers,
    });
  }

  updateCollectiveOfficer(person: any, id: number, image: any): Observable<any> {
    const formData = new FormData();
    formData.append('officerData', JSON.stringify(person));
    formData.append('file', image);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.put(`${this.apiUrl}/manage-officers/update-officer/${id}`, formData, {
      headers,
    });
  }

  disclaimOfficer(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  console.log('id', id)
    return this.http.put(`${this.apiUrl}/manage-officers/disclaim-officer/${id}`, {}, {
      headers,
    });
  }

  getOfficerByEmpId(role: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.apiUrl}/manage-officers/get-officer-by-empId/${role}`, {
      headers,
    });
  }

  claimOfficer(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    return this.http.patch(`${this.apiUrl}/manage-officers/claim-officer`, { id }, {
      headers,
    });
  }


  editOfficerTarget(id: number | null, targetItemId: number, amount: number): Observable<any> {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/manage-officers/edit-officer-target`;

    return this.http.patch<any>(url, { officerId: id, target: targetItemId, amount: amount }, { headers });
  }


  getTargetDetails(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/manage-officers/get-target-details/${id}`;

    return this.http.get<any>(url, { headers });
  }

  getCCHOwnCenters(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.apiUrl}/manage-officers/get-centers-cch-own`, {
      headers,
    });
  }

  getAllOfficersForCCH(page: number = 1, limit: number = 10, status: string = '', role: string = '', searchText: string = '', selectcenter: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/manage-officers/get-all-officers-for-cch?page=${page}&limit=${limit}`

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

  getCenterManagers(id: number | string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/manage-officers/get-center-managers/${id}`, {
      headers,
    });
  }

  CCHcreateCollectiveOfficer(person: any, selectedImage: any, driver: any, licFront: any, licBack: any, insFront: any, insBack: any, vehiFront: any, vehiBack: any, vehiSideA: any, vehiSideB: any): Observable<any> {
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
    return this.http.post(`${this.apiUrl}/manage-officers/cch-create-officer`, formData, {
      headers,
    });
  }

  CCHupdateCollectiveOfficer(person: any, id: number, image: any, driver: any, licFront: any, licBack: any, insFront: any, insBack: any, vehiFront: any, vehiBack: any, vehiSideA: any, vehiSideB: any): Observable<any> {
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
    return this.http.put(`${this.apiUrl}/manage-officers/cch-update-officer/${id}`, formData, {
      headers,
    });
  }

  getProfileImageBase64(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get(`${this.apiUrl}/manage-officers/get-profile-image-base64-by-id/${id}`, {
      headers,
    });
  }

  // getDCHOwnCenters(): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.token}`,
  //     'Content-Type': 'application/json',
  //   });
  //   return this.http.get(`${this.apiUrl}/manage-officers/get-centers-dch-own`, {
  //     headers,
  //   });
  // }
  
}



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

    console.log('province', province, 'district', district)

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


  createDistributionCenter(centerData: any) {
    console.log('centerData', centerData)
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

  getAllAssignOrders(status: string = '', searchText: string = '', selectDate: string | Date | null = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });


    let url = `${this.apiUrl}/get-all-assign-orders?test=${1}`;
    if (status) {
      url += `&status=${status}`
    }

    if (searchText) {
      url += `&searchText=${searchText}`

    }

    if (selectDate) {
      url += `&date=${selectDate}`
    }

    return this.http.get<any>(url, { headers });
  }

  getToDoAssignOrders(status: string = '', searchText: string = '', selectDate: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });


    let url = `${this.apiUrl}/get-todo-assign-orders?test=${1}`;
    if (status) {
      url += `&status=${status}`
    }

    if (searchText) {
      url += `&searchText=${searchText}`

    }

    if (selectDate) {
      url += `&date=${selectDate}`
    }

    return this.http.get<any>(url, { headers });
  }

  getCompletedAssignOrders(searchText: string = '', selectDate: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });


    let url = `${this.apiUrl}/get-completed-assign-orders?test=${1}`;

    if (searchText) {
      url += `&searchText=${searchText}`

    }

    if (selectDate) {
      url += `&date=${selectDate}`
    }

    return this.http.get<any>(url, { headers });
  }

  getOutForDeliveryOrders(status: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });


    let url = `${this.apiUrl}/get-out-for-delivery-orders?test=${1}`;
    if (status) {
      url += `&status=${status}`
    }

    if (searchText) {
      url += `&searchText=${searchText}`

    }

    return this.http.get<any>(url, { headers });
  }

  setStatusAndTime(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
  
    const url = `${this.apiUrl}/set-status-and-time`;
  
    // Sending the orderIds in request body
    return this.http.post<any>(url, { data }, { headers });
  }

  getofficerTargets(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });


    let url = `${this.apiUrl}/get-officer-targets`;
    

    return this.http.get<any>(url, { headers });
  }

  getSelectedOfficerTargets(officerId: number, searchText: string = '', status: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
  
    console.log('get-selected-officer-targets')
    let url = `${this.apiUrl}/get-selected-officer-targets?officerId=${officerId}`;
  
    if (searchText) {
      url += `&searchText=${searchText}`
  
    }
  
    if (status) {
      url += `&status=${status}`
    }
  
    return this.http.get<any>(url, { headers });
  }

  getOfficers(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
  
  
    let url = `${this.apiUrl}/get-officers`;

  
    return this.http.get<any>(url, { headers });
  }

  passTarget(processOrderIds: number[], disTargetId: number, officerId: number | '', id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  
    const url = `${this.apiUrl}/pass-target`; 
  
    const data = {
      processOrderIds: processOrderIds,
      distributedTargetId: disTargetId,
      officerId: officerId,
      previousOfficerId: id 
    };
  
    return this.http.post<any>(url, data, { headers });
  }

  // getAllProducts(): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.token}`,
  //     'Content-Type': 'application/json'
  //   });
  
  //   const url = `${this.apiUrl}/get-all-products`; 
  
  //   return this.http.get<any>(url, { headers });
  // }

  getCenterTarget(centerId: number, searchText: string = '', status: string = '', selectDate: string | Date | null = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
  
    console.log('selectDate', selectDate)
    let url = `${this.apiUrl}/get-center-target?centerId=${centerId}`;
  
    if (searchText) {
      url += `&searchText=${searchText}`
  
    }
  
    if (status) {
      url += `&status=${status}`
    }

    if (selectDate) {
      url += `&date=${selectDate}`
    }
  
    return this.http.get<any>(url, { headers });
  }

  getCenterTargetForDelivery(centerId: number, searchText: string = '', status: string = '', selectDate: string | Date | null = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    console.log('selectDate', selectDate)
  
  
    let url = `${this.apiUrl}/get-center-target-out-for-delivery?centerId=${centerId}`;
  
    if (searchText) {
      url += `&searchText=${searchText}`
  
    }
  
    if (status) {
      url += `&status=${status}`
    }

    if (selectDate) {
      url += `&date=${selectDate}`
    }
  
    return this.http.get<any>(url, { headers });
  }

  generateRegCode(
    province: string,
    district: string,
    city: string): Observable<{ regCode: string }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/generate-regcode`;

    return this.http.post<{ regCode: string }>(url, { province, district, city }, { headers });
  }

}









import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenServiceService } from '../Token/token-service.service';

@Injectable({
  providedIn: 'root'
})
export class DistributionComplaintsService {

  private apiUrl = `${environment.API_BASE_URL}/distribution-complaints`;
  private token!: string | null;

  constructor(private http: HttpClient, private tokenSrv: TokenServiceService) {
    this.token = this.tokenSrv.getToken()
  }

  dcmGetAllReciveComplaints(page: number = 1, limit: number = 10, status: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });


    let url = `${this.apiUrl}/dcm-get-recived-complaints?page=${page}&limit=${limit}`;
    console.log('fetching service')
    if (status) {
      url += `&status=${status}`
    }

    if (searchText) {
      url += `&searchText=${searchText}`

    }

    return this.http.get<any>(url, { headers });
  }

  dcmGetComplainById(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/dcm-get-recived-complaints-by-id/${id}`;
    return this.http.get<any>(url, { headers });
  }

  replyToComplaint(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/dcm-reply-complaint`;
    return this.http.patch<any>(url, data, { headers });
  }

  dcmforwordComplaint(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/dcm-forword-to-complaint/${id}`;
    return this.http.patch<any>(url, {}, { headers });
  }

  // getComplainCategory(): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.token}`
  //   });

  //   let url = `${this.apiUrl}/get-complain-category`;
  //   return this.http.get<any>(url, { headers });
  // }

  dcmSubmitComplaint(data: { category: string; complaint: string }): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/dcm-add-complain`;
    return this.http.post<any>(url, data, { headers });
  }

  dcmGetAllSentComplains(page: number = 1, limit: number = 10, status: string = '', emptype: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });


    let url = `${this.apiUrl}/dcm-get-all-sent-complaint?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`
    }

    if (emptype) {
      url += `&emptype=${emptype}`
    }

    if (searchText) {
      url += `&searchText=${searchText}`
    }

    return this.http.get<any>(url, { headers });
  }

  dcmGetReplyByComplaintId(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/dcm-get-reply-by-complaint-id/${id}`;
    return this.http.get<any>(url, { headers });
  }
}

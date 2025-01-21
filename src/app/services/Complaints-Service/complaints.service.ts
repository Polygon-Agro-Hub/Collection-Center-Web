import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsService {
  private apiUrl = `${environment.API_BASE_URL}/complaint`;
  private token = `${environment.TOKEN}`;



  constructor(private http: HttpClient) { }

  getAllReciveComplaints(page: number = 1, limit: number = 10, status: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });


    let url = `${this.apiUrl}/get-recived-complaints?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`
    }

    if (searchText) {
      url += `&searchText=${searchText}`

    }

    return this.http.get<any>(url, { headers });
  }

  getReply(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-recived-complaints-by-id/${id}`;
    return this.http.get<any>(url, { headers });
  }
}

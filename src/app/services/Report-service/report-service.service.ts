import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {
    private apiUrl = `${environment.API_BASE_URL}`;
    private token = `${environment.TOKEN}`;
  

  constructor(private http: HttpClient) { }

  getAllCollectionReport( page: number = 1, limit: number = 10, searchText:string = ''): Observable<any> {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      });
  
      let url = `${this.apiUrl}/manage-officers/get-all-officers?page=${page}&limit=${limit}`
  
      if(searchText){
        url +=`&searchText=${searchText}`
      }
  
      return this.http.get(url, {
        headers,
      });
    }
}

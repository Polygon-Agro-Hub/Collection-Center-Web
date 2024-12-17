import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManageOfficersService {
  private apiUrl = `${environment.API_BASE_URL}`;
  private token = `${environment.TOKEN}`;



  constructor(private http: HttpClient) { }

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

  createCollectiveOfficer(person:any , bank:any, company:any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.post(`${this.apiUrl}/manage-officers/create-officer`, {officerData:person, companyData:company, bankData:bank}, {
      headers,
    });
  }
}

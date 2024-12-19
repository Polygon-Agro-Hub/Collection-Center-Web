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


  getAllManagersByCenter(centerId:string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.apiUrl}/manage-officers/get-by-managerID/${centerId}`, {
      headers,
    });
  }

  getAllOfficers( page: number = 1, limit: number = 10, company:string ='', role:string = '', searchText:string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/manage-officers/get-all-officers?page=${page}&limit=${limit}`

    if(company){
      url += `&company=${company}`
    }

    if(role){
      url +=`&role=${role}`
    }

    if(searchText){
      url +=`&searchText=${searchText}`
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

  deleteOfficer(id:number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/manage-officers/delete-officer/${id}`;
    return this.http.delete<any>(url, { headers });
  }

  ChangeStatus(id:number, status:string): Observable<any> {
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

  updateCollectiveOfficer(person:any , bank:any, company:any, id:number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.put(`${this.apiUrl}/manage-officers/update-officer/${id}`, {officerData:person, companyData:company, bankData:bank}, {
      headers,
    });
  }
}




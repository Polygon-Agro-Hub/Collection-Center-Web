import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { TokenServiceService } from '../Token/token-service.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DistributionProcurementService {

  private apiUrl = `${environment.API_BASE_URL}/distribution-procurements`;
  private token!: string | null;

  constructor(
    private http: HttpClient,
    private tokenSrv: TokenServiceService,
  ) {
    this.token = this.tokenSrv.getToken();
  }

  getDistributionCenterDetails(
    page: number = 1,
    limit: number = 10,
    province: string = '',
    district: string = '',
    search: string = '',
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

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

    getShortageDetails(): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });

  const url = `${this.apiUrl}/shortage-details`;

  return this.http.get<any>(url, { headers });
}

getShortageDetailsById(id: number | string): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });

  const url = `${this.apiUrl}/shortage-details/${id}`;

  return this.http.get<any>(url, { headers });
}

getShortageAssignedDetails(id: number | string): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });

  const url = `${this.apiUrl}/shortage-assigned-details/${id}`;

  return this.http.get<any>(url, { headers });
}

assignShortage(id: number | string, data: { comCenId: number; qty: number; ceilling: number }): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });

  const url = `${this.apiUrl}/assign-shortage/${id}`;

  return this.http.post<any>(url, data, { headers });
}

  getShortageToFinalizeList(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/shortage/to-finalize`;

    return this.http.get<any>(url, { headers });
  }

  getShortageFinalizedList(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/shortage/finalized`;

    return this.http.get<any>(url, { headers });
  }

  finalizeShortageAssigned(
    shortageAssignedId: number,
    comCenId: number,
    ceilingPercent: number,
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/shortage/finalize`;

    return this.http.put<any>(
      url,
      { shortageAssignedId, comCenId, ceilingPercent },
      { headers },
    );
  }
}

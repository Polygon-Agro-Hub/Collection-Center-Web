import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenServiceService } from '../Token/token-service.service';
import { environment } from '../../environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface OrderPackageResponse {
  invNo: string;
  packages: Package[];
}

interface Package {
  packageId: number;
  displayName: string;
  productPrice: number;
  productTypes: ProductType[];
}

interface ProductType {
  id: number;
  typeName: string;
  productId: number;
  qty: number;
  price: number;
  displayName: string;
  shortCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProcurementsService {
  private apiUrl = `${environment.API_BASE_URL}/procurements`;
  private token!: string | null;

  constructor(private http: HttpClient, private tokenSrv: TokenServiceService) {
    this.token = this.tokenSrv.getToken()
  }

  getAllCollectionReport(role: string, page: number = 1, limit: number = 10, searchText: string = '', centerId:string=''): Observable<any> {
    console.log('this is seacrch', searchText)
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-collection-reports-details?page=${page}&limit=${limit}&role=${role}`

    if (searchText) {
      url += `&searchText=${searchText}`
    }

    if(centerId) {
      url += `&center=${centerId}`
    }

    return this.http.get(url, {
      headers,
    });
  }

  getAllOrdersWithProcessInfo(
    page: number,
    limit: number,
    statusFilter: string = '',
    dateFilter: string = '',
    dateFilter1: string = '',
    searchText: string = ''
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/orders-process-info?page=${page}&limit=${limit}`;

    if (statusFilter) {
      url += `&statusFilter=${statusFilter}`;
    }

    if (dateFilter) {
      url += `&dateFilter=${dateFilter}`;
    }

    if (dateFilter1) {
      url += `&dateFilter1=${dateFilter1}`;
    }

    if (searchText) {
      url += `&searchText=${searchText}`;
    }

    return this.http.get<any>(url, { headers });
  }

  getAllMarketplaceItems(orderId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    const url = `${this.apiUrl}/get-marketplace-item/${orderId}`;

    return this.http.get<any>(url, { headers }).pipe(
      map((response) => {
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      }),
      catchError((error) => {
        console.error('Error fetching marketplace items:', error);
        return throwError(
          () =>
            new Error(
              error.error?.message ||
                'An error occurred while fetching marketplace items'
            )
        );
      })
    );
  }

  getOrderDetailsById(
    id: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });


    let url = `${this.apiUrl}/get-order-details/${id}`;

    return this.http.get<any>(url, { headers });
  }

  updateDefinePackageItemData(array: any, id:number): Observable<any> {
    console.log('array', array)
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
  
    const url = `${this.apiUrl}/update-define-package-data`;
  
    // Send the array as a named field in the body
    return this.http.post<any>(url, { definePackageItems: array, orderId:id}, { headers });
  }

  getExcludedItems(orderId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
  
  
    let url = `${this.apiUrl}/get-excluded-items/${orderId}`;
  
    return this.http.get<any>(url, { headers });
  }

  createOrderPackageItems(
    orderPackageId: number,
    products: any[]
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    // Structure the data to match the endpoint's expected format
    const requestData = {
      orderPackageId: orderPackageId,
      products: products,
    };

    // Log the data being sent
    console.log('Sending package items:', requestData);

    return this.http
      .post(`${this.apiUrl}/add-order-package-item`, requestData, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error in createOrderPackageItems:', error);
          return throwError(() => new Error(error));
        })
      );
  }

  getAllOrdersWithProcessInfoDispatched(
    page: number,
    limit: number,
    dateFilter: string = '',
    searchTerm: string = ''
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    console.log('datefilte', dateFilter, 'searchTerm', searchTerm)

    let url = `${this.apiUrl}/orders-process-info-dispatched?page=${page}&limit=${limit}`;

    if (dateFilter) {
      url += `&dateFilter=${dateFilter}`;
    }

    if (searchTerm) {
      url += `&searchTerm=${searchTerm}`;
    }

    return this.http.get<any>(url, { headers });
  }

  getOrderPackagesByOrderId(orderId: number): Observable<any> {
    console.log('sending oid', orderId)
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    const url = `${this.apiUrl}/order-packages/${orderId}`;

    return this.http.get<any>(url, { headers }).pipe(
      map((response) => {
        console.log('response', response)
        if (response.success) {
          return {
            invNo: response.data.invNo,
            packages: response.data.packages,
            additionalItems:response.additionalItems
          };
        } else {
          throw new Error(response.message);
        }
      }),
      catchError((error) => {
        console.error('Error fetching order packages:', error);
        return throwError(
          () =>
            new Error(
              error.error?.message ||
                'An error occurred while fetching order packages'
            )
        );
      })
    );
  }

}




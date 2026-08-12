import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { TokenServiceService } from '../Token/token-service.service';
import { environment } from '../../environments/environment';

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

    return this.http.post<any>(url, data, { headers });
  }

  getAllRequests(date: string = '', status: string = '', searchText: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-all-request?page=${1}`

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

  getProductsForUser(rrId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-products-for-user/${rrId}`

    return this.http.get(url, {
      headers,
    });
  }

  approveRequest(requestObj: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/approve-request`

    return this.http.post(url, requestObj, { headers });
  }

  rejectRequest(requestObj: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/reject-request`

    return this.http.post(url, requestObj, { headers });
  }

  getAllAssignOrders(status: string = '', searchText: string = '', selectDate: string | Date | null = '', type: string = '', timeSlot: string = '', row: number | null, cenId: number | null): Observable<any> {
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

    if (type) {
      url += `&type=${type}`
    }

    if (timeSlot) {
      url += `&timeSlot=${timeSlot}`
    }

    if (row) {
      url += `&row=${row}`
    }

    if (cenId) {
      url += `&cenId=${cenId}`
    }

    return this.http.get<any>(url, { headers });
  }

  getToDoAssignOrders(status: string = '', searchText: string = '', selectDate: string = '', type: string = '', timeSlot: string = '', row: number | null): Observable<any> {
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

    if (type) {
      url += `&type=${type}`
    }

    if (timeSlot) {
      url += `&timeSlot=${timeSlot}`
    }

        if (row) {
      url += `&row=${row}`
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

  getOutForDeliveryOrders(status: string = '', searchText: string = '', type: string = '', timeSlot: string = '', row: number | null, selectDate: string | Date | null = '', cenId: number | null): Observable<any> {
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

    if (type) {
      url += `&type=${type}`
    }

    if (timeSlot) {
      url += `&timeSlot=${timeSlot}`
    }

    if (row) {
      url += `&row=${row}`
    }

        if (selectDate) {
      url += `&date=${selectDate}`
    }

        if (cenId) {
      url += `&cenId=${cenId}`
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

  getofficerTargets(date: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-officer-targets/${date}`;
    
    return this.http.get<any>(url, { headers });
  }

  getSelectedOfficerTargets(officerId: number, searchText: string = '', status: string = '', completingStatus: string = '', date: string = ""): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
  
    let url = `${this.apiUrl}/get-selected-officer-targets?officerId=${officerId}`;
  
    if (searchText) {
      url += `&searchText=${searchText}`
    }
  
    if (status) {
      url += `&status=${status}`
    }

    if (completingStatus) {
      url += `&completingStatus=${completingStatus}`
    }

    if (date) {
      url += `&date=${date}`
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

  getCenterTarget(centerId: number, searchText: string = '', status: string = '', selectDate: string | Date | null = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

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


  downloadAllTargetProgressReport(
    status: string,
    date: Date | string | null,
    searchText: string = '',
    type: string = '',
    row: number | null,
    timeSlot: string = ''

  ): Observable<Blob> {
    let url = `${this.apiUrl}/download-all-target-progress?test=${1}`;

    if (status) {
      url += `&status=${status}`;
    }

    if (date) {
      url += `&date=${date}`;
    }

    if (searchText) {
      url += `&searchText=${searchText}`;
    }

    if (type) {
      url += `&type=${type}`;
    }
    if (row) {
      url += `&row=${row}`;
    }

    if (timeSlot) {
      url += `&timeSlot=${timeSlot}`;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get(url, { headers, responseType: 'blob' });
  }

  downloadOutForDeliveryTargetProgressReport(
    status: string,
    searchText: string = '',
    type: string = '',
    row: number | null,
    timeSlot: string = '',
    date: Date | string | null,
  ): Observable<Blob> {
    let url = `${this.apiUrl}/download-out-for-delivery-target-progress?test=${1}`;

    if (status) {
      url += `&status=${status}`;
    }

    if (searchText) {
      url += `&searchText=${searchText}`;
    }

     if (type) {
      url += `&type=${type}`;
    }
    if (row) {
      url += `&row=${row}`;
    }

    if (timeSlot) {
      url += `&timeSlot=${timeSlot}`;
    }


    if (date) {
      url += `&date=${date}`;
    }


    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get(url, { headers, responseType: 'blob' });
  }

  downloadDCHOutForDeliveryTargetProgressReport(
    status: string,
    date: Date | string | null,
    searchText: string = '',
    centerId: number
  ): Observable<Blob> {
    let url = `${this.apiUrl}/download-dch-out-for-delivery-target-progress?centerId=${centerId}`;

    if (status) {
      url += `&status=${status}`;
    }

    if (date) {
      url += `&date=${date}`;
    }

    if (searchText) {
      url += `&searchText=${searchText}`;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get(url, { headers, responseType: 'blob' });
  }

  getAssignForCityes(province: string, district: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.apiUrl}/get-all-assigning-cities/${province}/${district}`, {
      headers,
    });
  }

  AssigCityToDistributedCenter(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.apiUrl}/assign-city-to-distributed-center`, data, {
      headers,
    });
  }

  removeAssigCityToDistributedCenter(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.apiUrl}/remove-assign-city-to-distributed-center`, data, {
      headers,
    });
  }

  getSelectedDistributionOfficerTargets(officerId: number, centerId: number, searchText: string = '', status: string = '', date: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-selected-distribution-officer-targets?officerId=${officerId}&centerId=${centerId}`;
  
    if (searchText) {
      url += `&searchText=${searchText}`
    }
  
    if (status) {
      url += `&status=${status}`
    }

    if (date) {
      url += `&date=${date}`
    }
  
    return this.http.get<any>(url, { headers });
  }

  downloadRequestedItemsReportFile(
    officerId: number, centerId: number, search: string = '', status: string = '', date: string = ''
  ): Observable<Blob> {
    let url = `${this.apiUrl}/download-officer-targets?officerId=${officerId}&centerId=${centerId}`;

    if (search) {
      url += `&search=${search}`;
    }

    if (status) {
      url += `&status=${status}`;
    }

    if (date) {
      url += `&date=${date}`;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get(url, { headers, responseType: 'blob' });
  }

  getDispatchChartData(): Observable<any[]> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });
  
  return this.http.get<any[]>(`${this.apiUrl}/get-dispatch-chart`, {
    headers,
  }).pipe(
    catchError(error => {
      console.error('API Error:', error);
      return of([]); // Return empty array on error
    })
  );
}

getCenterData(): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`
  });

  let url = `${this.apiUrl}/get-center-data`;
  return this.http.get<any>(url, { headers });
}

getCentreDataById(centreId: number): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`
  });

  let url = `${this.apiUrl}/get-center-data-by-id/${centreId}`;

  return this.http.get<any>(url, { headers });
}

editCenter(centerData: any): Observable<any> {
  const formData = new FormData();
  formData.append('centerData', JSON.stringify(centerData));

  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
  });
  return this.http.post(`${this.apiUrl}/edit-center`, formData, {
    headers,
  });
}


getTodaysDeliveries(activeTab: string = '', status: string = '', searchText: string = '', date: string | Date | null = '', timeSlot: string = '' ): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });

  let url = `${this.apiUrl}/get-todays-deliveries?activeTab=${activeTab}`;

    if (status) {
      url += `&status=${status}`;
    }

    if (searchText) {
      url += `&searchText=${encodeURIComponent(searchText)}`;
    }

    if (date) {
      url += `&date=${date}`;
    }

    if (timeSlot) {
      url += `&timeSlot=${timeSlot}`;
    }

    return this.http.get(url, { headers });

}

getTodayDeliveryTracking(id: number | null): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });
  return this.http.get<any>(`${this.apiUrl}/get-today-delivery-tracking/${id}`, { headers });
}

getRecivedCashDashbord(): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });
  return this.http.get<any>(`${this.apiUrl}/get-recived-cash-dashbord`, { headers });
}

getPickupCashRevenue(
  searchText: string = '', selectDate: string | Date | null = '', status: string =''
): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });

  let url = `${this.apiUrl}/get-pikup-cash-revenue?page=${1}`;
  if (searchText) {
    url += `&searchText=${encodeURIComponent(searchText)}`;
  }

  if (selectDate) {
    url += `&selectDate=${selectDate}`;
  }

  if (status) {
    url += `&status=${status}`;
  }

  return this.http.get<any>(
    url, { headers }
  );
}

getDriverCashRevenue(
  searchText: string = '', selectDate: string | Date | null = '', status: string =''
): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });

  let url = `${this.apiUrl}/get-driver-cash-revenue?page=${1}`;
  if (searchText) {
    url += `&searchText=${encodeURIComponent(searchText)}`;
  }

  if (selectDate) {
    url += `&selectDate=${selectDate}`;
  }

  if (status) {
    url += `&status=${status}`;
  }

  return this.http.get<any>(
    url, { headers }
  );
}

  getDCHCenterRows(centerId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-dch-center-row?centerId=${centerId}`;
  
    return this.http.get<any>(url, { headers });
  }

  createDCHCenterRow(centerId: number, nextRow: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/create-dch-center-row?centerId=${centerId}&nextRow=${nextRow}`;
  
    return this.http.put<any>(url, {}, { headers });
  }

  createDCHCenterPos(centerId: number, nextPos: number, rowId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/create-dch-center-pos?centerId=${centerId}&nextPos=${nextPos}&rowId=${rowId}`;
  
    return this.http.put<any>(url, {}, { headers });
  }

  toggleRow(enableStatus: number, id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/dch-center-enable-row?enableStatus=${enableStatus}&id=${id}`;

    return this.http.put<any>(url, {}, { headers });
  }

  deleteDCHCenterPos(posId: number, rowId: number, pIndex: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/delete-dch-center-pos/${posId}/${rowId}/${pIndex}`;

    return this.http.delete<any>(url, { headers });
  }

  getDCMCenterId(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-dcm-center-id`;
  
    return this.http.get<any>(url, { headers });
  }

  getDCMPositioningRows(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-dcm-positioning-rows`;
  
    return this.http.get<any>(url, { headers });
  }

  getDcmPositionsForRows(rowId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/get-dcm-positions-for-row/${rowId}`;
  
    return this.http.get<any>(url, { headers });
  }

  saveDcmPositionItems(rowId: number, addedItems: any[], deletedItems: any[]): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    const url = `${this.apiUrl}/save-dcm-position-products`;

    const data = {
      rowId,
      addedItems,
      deletedItems
    };

    return this.http.post<any>(url, data, { headers });
  }

  fetchAllShortageTodayToDo(
  status: string ='', searchText: string = ''
): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });

  const page  = 1;

  let url = `${this.apiUrl}/get-shortage-products-today-todo?page=${page}`;
  if (searchText) {
    url += `&searchText=${encodeURIComponent(searchText)}`;
  }

  if (status) {
    url += `&status=${status}`;
  }

  return this.http.get<any>(
    url, { headers }
  );
}

fetchAllShortageTodayCompleted( searchText: string = ''
): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });

  const page  = 1;

  let url = `${this.apiUrl}/get-shortage-products-today-completed?page=${page}`;
  if (searchText) {
    url += `&searchText=${encodeURIComponent(searchText)}`;
  }

  return this.http.get<any>(
    url, { headers }
  );
}

 assignOfficerToProduct(shortageId: number | null, shortageAssignId: number | null, officerId: number | null): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${this.apiUrl}/assign-officer-to-shortage?shortageId=${shortageId}&shortageAssignId=${shortageAssignId}&officerId=${officerId}`;

    return this.http.put<any>(url, {}, { headers });
  }

  fetchAllShortageHistory(date: string | Date | null = '',  searchText: string = ''
): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });

  const page  = 1;

  let url = `${this.apiUrl}/get-shortage-products-histroy?page=${page}`;
  if (searchText) {
    url += `&searchText=${encodeURIComponent(searchText)}`;
  }

  if (date) {
    url += `&date=${date}`;
  }

  return this.http.get<any>(
    url, { headers }
  );
}

  getOutForDeliveryOrderDeatils(poId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    let url = `${this.apiUrl}/get-order-details-for-out-for-delivery/${poId}`

    return this.http.get(url, {
      headers,
    });
  }

}
















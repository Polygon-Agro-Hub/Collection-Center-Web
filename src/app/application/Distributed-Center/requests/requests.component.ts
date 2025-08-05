import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { DropdownModule } from 'primeng/dropdown';
import { PriceListService } from '../../../services/Price-List-Service/price-list.service';
import Swal from 'sweetalert2';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DistributionServiceService } from '../../../services/Distribution-Service/distribution-service.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit {

  requestArr!: Request[];
  selectedRequestObj!: Request

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  searchText: string = '';

  selectStatus: string = '';
  today!: string;
  isPopupVisible: boolean = false
  isLoading: boolean = false;

  date:  string = '';

  isReplacePopUpOpen: boolean = false;

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Not Approved', 'Approved', 'Rejected'];

  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  selectStatusOption(option: string) {
    this.selectStatus = option;
    this.isStatusDropdownOpen = false;
    this.filterStatus();
  }

  constructor(
    private router: Router,
    private PriceListSrv: PriceListService,
    private distributionSrv: DistributionServiceService,
    private toastSrv: ToastAlertService
  ) { }

  ngOnInit(): void {
    this.date = new Date().toISOString().split('T')[0];
    console.log('date', this.date)
    this.fetchAllRequests()
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const statusDropdownElement = document.querySelector('.custom-status-dropdown-container');
    const statusDropdownClickedInside = statusDropdownElement?.contains(event.target as Node);

    if (!statusDropdownClickedInside && this.isStatusDropdownOpen) {
      this.isStatusDropdownOpen = false;
    }

  }

  fetchAllRequests(page: number = 1, limit: number = this.itemsPerPage, date: string = this.date, status: string = '', search: string = this.searchText) {
    this.isLoading = true;
    this.distributionSrv.getAllRequests(page, limit, date, status, search).subscribe(
      (res) => {
        console.log('res', res)
        this.requestArr = res.items;
        this.totalItems = res.total;
        console.log(res)
        console.log(res.items)


        if (res.items.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;

        }
        this.isLoading = false;
      }
    )
  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchAllRequests(this.page, this.itemsPerPage);
  }

  onDateChange() {
    console.log('called')
    this.fetchAllRequests(this.page, this.itemsPerPage, this.date, this.selectStatus, this.searchText);
  }

  onSearch() {
    this.fetchAllRequests(this.page, this.itemsPerPage, this.date, this.selectStatus, this.searchText);
  }

  offSearch() {
    this.searchText = '';
    this.fetchAllRequests(this.page, this.itemsPerPage, this.date, this.selectStatus, this.searchText);
  }

  cancelStatus(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectStatus = '';
    this.isStatusDropdownOpen = false;
    this.fetchAllRequests(this.page, this.itemsPerPage, this.date, this.selectStatus, this.searchText);
  }

  filterStatus() {
    this.fetchAllRequests(this.page, this.itemsPerPage, this.date, this.selectStatus, this.searchText);
  }

  navigate(path: string) {
    this.router.navigate([`${path}`]);
  }

  openReplacePopUp(item: Request) {
    this.selectedRequestObj = item
    console.log('selectedRequestObj', this.selectedRequestObj);
    this.isReplacePopUpOpen = true;
  }

  onReject( ) {
    this.isReplacePopUpOpen = false;
    this.selectedRequestObj.status = 'Rejected'
    this.isLoading = true;
  
    this.distributionSrv.rejectRequest(this.selectedRequestObj).subscribe({
      next: (res) => {
        console.log('Approval response:', res);
        console.log('res', res)
  
        if (res.data.success) {
          this.toastSrv.success('The Request has been Rejected successfully.')
          this.fetchAllRequests(); 
        } else {
          this.toastSrv.error('Request Rejection failed. Please try again.');
        }
  
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Approval error:', err);
        this.toastSrv.error('An error occurred during Rejecting.');
        this.isLoading = false;
      }
    });
  }

  onApprove() {
    this.isReplacePopUpOpen = false;
    console.log('selectedRequestObj', this.selectedRequestObj);
    this.isLoading = true;
  
    this.distributionSrv.approveRequest(this.selectedRequestObj).subscribe({
      next: (res) => {
        console.log('Approval response:', res);
  
        if (res.data.success) {
          
          this.toastSrv.success('The Request has been Approved and product replaced successfully.')
  
          this.fetchAllRequests(); 
        } else {
          this.toastSrv.error('Request Approval failed. Please try again.');
        }
  
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Approval error:', err);
        this.toastSrv.error('An error occurred during approval.');
        this.isLoading = false;
      }
    });
  }
  


}

class Request {
  rrId!: number;
  officerId!: number
  replceId!: number
  orderPackageId!: number
  currentProductTypeId!: number
  currentProductQty!: number
  currentProductPrice!: number
  currentprodcutType!: string
  currentProductTypeName!: string
  isPacked!: boolean
  status!: string
  empId!: string
  isLock!: boolean
  currentProduct!: string
  replaceProductId!: number
  replaceQty!: number
  replaceProduct!: string
  replacePrice!: number
  replaceProductType!: string;
  replaceUnitPrice!: number;
  createdAt!: Date;
}

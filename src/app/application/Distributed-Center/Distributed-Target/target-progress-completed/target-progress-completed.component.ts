import { CommonModule, DatePipe, Location  } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-target-progress-completed',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './target-progress-completed.component.html',
  styleUrl: './target-progress-completed.component.css'
})
export class TargetProgressCompletedComponent implements OnInit{
  ordersArr!: orders[];
  searchText: string = '';
  selectStatus: string = '';

  date:  string = '';

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  isLoading:boolean = true;

  selectedOrderIds: number[] = []; 
  allChecked: boolean = false; 

  isOutForDelivery = false;

  constructor(
    private router: Router,
    private ComplainSrv: ComplaintsService,
    private DistributionSrv: DistributionServiceService,
    private location: Location,
    private toastSrv: ToastAlertService
  ) { }


  ngOnInit(): void {
    const today = new Date();
    this.date = today.toISOString().split('T')[0];
    this.fetchCompletedAssignOrders();
  }

  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent) {
  //   const statusDropdownElement = document.querySelector('.custom-status-dropdown-container');
  //   const statusDropdownClickedInside = statusDropdownElement?.contains(event.target as Node);

  //   if (!statusDropdownClickedInside && this.isStatusDropdownOpen) {
  //     this.isStatusDropdownOpen = false;
  //   }

  // }

  fetchCompletedAssignOrders(search: string = this.searchText, selectDate: string = this.date) {
    this.isLoading = true;
    this.DistributionSrv.getCompletedAssignOrders(search, selectDate).subscribe(
      (res) => {

        this.totalItems = res.items.length;
        this.ordersArr = res.items.map((item: any) => {
          let status = '';
        
          if (item.packageStatus === 'Pending' && (item.additionalItemsStatus === 'Unknown' || item.additionalItemsStatus === 'Pending')) {
            status = 'Pending';
          }
          else if (item.packageStatus === 'Pending' && (item.additionalItemsStatus === 'Opened' || item.additionalItemsStatus === 'Completed')) {
            status = 'Opened';
          }
          else if (item.packageStatus === 'Opened') {
            status = 'Opened';
          }
          else if (item.packageStatus === 'Completed' && item.additionalItemsStatus === 'Unknown') {
            status = 'Completed';
          }
          else if (item.packageStatus === 'Completed' && item.additionalItemsStatus === 'Pending') {
            status = 'Pending';
          }
          else if (item.packageStatus === 'Completed' && item.additionalItemsStatus === 'Opened') {
            status = 'Opened';
          }
          else if (item.packageStatus === 'Completed' && item.additionalItemsStatus === 'Completed') {
            status = 'Completed';
          }
          else if (item.packageStatus === 'Unknown' && item.additionalItemsStatus === 'Pending') {
            status = 'Pending';
          }
          else if (item.packageStatus === 'Unknown' && item.additionalItemsStatus === 'Opened') {
            status = 'Opened';
          }
          else if (item.packageStatus === 'Unknown' && item.additionalItemsStatus === 'Completed') {
            status = 'Completed';
          }
          else if (item.packageStatus === 'Unknown' && item.additionalItemsStatus === 'Unknown') {
            status = 'Unknown';
          }
        
          return {
            ...item,
            combinedStatus: status
          };
        });

        console.log('trders', this.ordersArr)

        
        
        if (res.items.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;

        }
        this.isLoading = false;

      }
    )
  }

  onSearch() {
    this.fetchCompletedAssignOrders();

  }

  offSearch() {
    this.searchText = '';
    this.fetchCompletedAssignOrders();

  }

  onDateChange() {
    console.log('called')
    this.fetchCompletedAssignOrders();
  }


  // onPageChange(event: number) {
  //   this.page = event;
  //   this.fetchCompletedAssignOrders(this.page, this.itemsPerPage);
  // }

  getDisplayDate(sheduleDate: string | Date): string {
    const today = new Date();
    const schedule = new Date(sheduleDate);
  
    // Normalize times to midnight for accurate date-only comparison
    today.setHours(0, 0, 0, 0);
    schedule.setHours(0, 0, 0, 0);
  
    const diffDays = Math.floor((schedule.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays === 2) {
      return 'Day after tomorrow';
    } else {
      // Format as MM/dd without year
      const month = (schedule.getMonth() + 1).toString().padStart(2, '0');  // Months are 0-based
      const day = schedule.getDate().toString().padStart(2, '0');
      return `${month}/${day}`;
    }
  }
  

  removeWithin(time: string): string {
    return time ? time.replace('Within ', '') : time;
  }

  isChecked(orderId: number): boolean {
    return this.selectedOrderIds.includes(orderId);
}


toggleOrder(orderId: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    
    if (isChecked) {
        if (!this.selectedOrderIds.includes(orderId)) {
            this.selectedOrderIds.push(orderId);
        }
    } else {
        this.selectedOrderIds = this.selectedOrderIds.filter(id => id !== orderId);
    }
    console.log('selectedOrderIds', this.selectedOrderIds);
    

    this.allChecked = this.selectedOrderIds.length === this.ordersArr.length;
}


toggleAllOrders(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.allChecked = isChecked;
    
    if (isChecked) {
      
        this.selectedOrderIds = this.ordersArr.map(item => item.processOrderId);
    } else {
        // Deselect all orders
        this.selectedOrderIds = [];
    }
    console.log('selectedOrderIds', this.selectedOrderIds)
}

deSelectAll() {
  this.selectedOrderIds = [];
  this.allChecked = false;
}

outForDelivery() {
  this.isOutForDelivery = true;
}

sendOutForDelivery() {

  const now = new Date();

const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');  // Months are 0-based
const day = String(now.getDate()).padStart(2, '0');

const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');

const currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

console.log(currentTime);

  if (this.allChecked) {
    console.log('allcehcke');
  } else {
    console.log('count', this.selectedOrderIds.length);
  }
  console.log('currentTime', currentTime)

  this.changeStatusAndTime({
    orderIds: this.selectedOrderIds,
    time: currentTime
  });
}

changeStatusAndTime(data: { orderIds: any[]; time: string }) {
  this.isLoading = true;
  console.log('change status');
  

  this.DistributionSrv.setStatusAndTime(data).subscribe({
    next: (res) => {
      this.isLoading = false;

      if (res && res.success) {
        this.toastSrv.success(`${data.orderIds.length} orders have been sent out for delivery!`, 'Success');
        this.isOutForDelivery = false;
      } else {
        this.toastSrv.error('Failed to sent out for delivery!', 'Error');
        this.isOutForDelivery = false;
      }
      this.fetchCompletedAssignOrders()
      this.allChecked = false;
    },
    error: (err) => {
      this.isLoading = false;
      console.error(err);
      this.toastSrv.error('Something went wrong!', 'Error');
      this.isOutForDelivery = false;
      this.fetchCompletedAssignOrders()
      this.allChecked = false;
    }
  });
}

cancelOutForDelivery() {
  this.isOutForDelivery = false;
}

}

class orders {
  processOrderId!: number
  orderId!: number
  invNo!: string
  isTargetAssigned!: boolean
  sheduleDate!: Date
  sheduleTime!: string
  packagePackStatus!: string
  status!: string
  officerId!: number
  firstNameEnglish!: string
  lastNameEnglish!: string
  outDlvrDateLocal!: string
  combinedStatus!: string
}

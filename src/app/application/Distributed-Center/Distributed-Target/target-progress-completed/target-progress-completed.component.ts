import { CommonModule, DatePipe, Location  } from '@angular/common';
import { Component, HostListener, OnInit, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';
import { CustomDatepickerComponent } from '../../../../components/custom-datepicker/custom-datepicker.component';
import { PostInvoiceServiceService } from '../../../../services/post-invoice-service/post-invoice-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-target-progress-completed',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent, CustomDatepickerComponent],
  templateUrl: './target-progress-completed.component.html',
  styleUrl: './target-progress-completed.component.css'
})
export class TargetProgressCompletedComponent implements OnInit{

  @Output() switchToOutForDelivery = new EventEmitter<void>();

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
    private toastSrv: ToastAlertService,
    private postInvoiceService: PostInvoiceServiceService
  ) { }


  ngOnInit(): void {
    const today = new Date();
    this.date = today.toISOString().split('T')[0];
    this.fetchCompletedAssignOrders();
  }

  fetchCompletedAssignOrders(search: string = this.searchText, selectDate: string = this.date) {
    this.isLoading = true;
    this.DistributionSrv.getCompletedAssignOrders(search, selectDate).subscribe(
      (res) => {

        this.totalItems = res.items.length;
        this.ordersArr = res.items.map((item: any) => {
          let status = '';
          
          const pkgStatus = item.packageStatus;
          const addStatus = item.additionalItemsStatus;
          
          // Priority 1: If either is Pending, combinedStatus is Pending
          if (pkgStatus === 'Pending' || addStatus === 'Pending') {
            status = 'Pending';
          }
          // Priority 2: If either is Opened (and none are Pending), combinedStatus is Opened
          else if (pkgStatus === 'Opened' || addStatus === 'Opened') {
            status = 'Opened';
          }
          // Priority 3: If both are Completed, combinedStatus is Completed
          else if (pkgStatus === 'Completed' && addStatus === 'Completed') {
            status = 'Completed';
          }
          // Priority 4: If one is Completed and other is Unknown, use the non-Unknown status
          else if (pkgStatus === 'Completed' && addStatus === 'Unknown') {
            status = 'Completed';
          }
          else if (pkgStatus === 'Unknown' && addStatus === 'Completed') {
            status = 'Completed';
          }
          // Default: Both are Unknown
          else {
            status = 'Unknown';
          }
        
          return {
            ...item,
            combinedStatus: status
          };
        });

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

  onDateChange(newDate: string | Date | null) {
    let formattedDate: string = '';
  
    if (newDate instanceof Date) {
      // Convert Date object to string (YYYY-MM-DD)
      formattedDate = newDate.toISOString().split('T')[0];
    } else if (typeof newDate === 'string') {
      formattedDate = newDate;
    }
  
    this.date = formattedDate;
    this.fetchCompletedAssignOrders();
  }


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
    this.changeStatusAndTime({
      orderIds: this.selectedOrderIds,
      time: currentTime
    });
}

changeStatusAndTime(data: { orderIds: any[]; time: string }) {
  this.isLoading = true;
  this.DistributionSrv.setStatusAndTime(data).subscribe({
    next: (res) => {
      this.isLoading = false;

      if (res && res.success) {
        const orderCount = data.orderIds.length < 10 ? ('0' + data.orderIds.length) : (data.orderIds.length);
        const orderLabel = data.orderIds.length === 1 ? 'order has' : 'orders have';
       
        this.toastSrv.success(`${orderCount} ${orderLabel} been released to the next stage.`, 'Success');
        this.isOutForDelivery = false;
        this.switchToOutForDelivery.emit();
      } else {
        this.toastSrv.error('Failed to sent out for delivery!', 'Error');
        this.isOutForDelivery = false;
      }
      this.fetchCompletedAssignOrders()
      this.allChecked = false;
      this.selectedOrderIds = [];
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

getScheduleClass(item: any): string {
  const now = new Date();
  const scheduleDate = new Date(item.sheduleDate);
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const scheduleOnlyDate = new Date(scheduleDate.getFullYear(), scheduleDate.getMonth(), scheduleDate.getDate());

  // Case 1: Schedule date is before today → RED
  if (scheduleOnlyDate < nowDate) {
    return 'schedule-past'; // CSS class name
  }
  
  // Case 2: Schedule date is today → check slot
  if (scheduleOnlyDate.getTime() === nowDate.getTime()) {
    let upperLimitHour = 0;
    if (item.sheduleTime.includes('8-12')) {
      upperLimitHour = 12;
    } else if (item.sheduleTime.includes('12-4')) {
      upperLimitHour = 16;
    } else if (item.sheduleTime.includes('4-8')) {
      upperLimitHour = 20;
    }
    const upperLimit = new Date(now);
    upperLimit.setHours(upperLimitHour, 0, 0, 0);

    if (now <= upperLimit) {
      return 'schedule-active'; // CSS class name
    } else {
      return 'schedule-expired'; // CSS class name
    }
  }
  
  // Case 3: Future date → no color
  return 'schedule-future'; // CSS class name
}

onKeydown(event: KeyboardEvent) {
  // Prevent space key
  if (event.key === ' ') {
    event.preventDefault();
    return;
  }
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

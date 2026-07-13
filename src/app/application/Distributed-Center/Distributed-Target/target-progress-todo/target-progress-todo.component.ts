import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';
import { CustomDatepickerComponent } from '../../../../components/custom-datepicker/custom-datepicker.component';

@Component({
  selector: 'app-target-progress-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent, CustomDatepickerComponent],
  templateUrl: './target-progress-todo.component.html',
  styleUrl: './target-progress-todo.component.css'
})
export class TargetProgressTodoComponent implements OnInit {

  ordersArr!: orders[];
  searchText: string = '';
  selectStatus: string = '';

  date:  string = '';

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  isLoading:boolean = true;

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Pending', 'Opened'];

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
    private ComplainSrv: ComplaintsService,
    private DistributionSrv: DistributionServiceService
  ) { }


  ngOnInit(): void {
    const today = new Date();
    this.date = today.toISOString().split('T')[0]; // format: YYYY-MM-DD
    this.fetchToDoAssignOrders();
  }

  fetchToDoAssignOrders(status: string = this.selectStatus, search: string = this.searchText, selectDate: string = this.date) {
    this.isLoading = true;
    this.DistributionSrv.getToDoAssignOrders(status, search, selectDate).subscribe(
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
    this.fetchToDoAssignOrders();

  }

  offSearch() {
    this.searchText = '';
    this.fetchToDoAssignOrders();

  }

  filterStatus() {
    this.fetchToDoAssignOrders();
  }

  cancelStatus(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectStatus = '';
    this.fetchToDoAssignOrders();
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
    this.fetchToDoAssignOrders();
  }

  navigateViewReply(id:number){
    this.router.navigate([`/cch-complaints/view-recive-reply/${id}`])
  }

getDateColor(item: any): string {
  const now = new Date();

  const today = new Date(now);
  const schedule = new Date(item.sheduleDate);

  // Normalize dates
  today.setHours(0, 0, 0, 0);
  schedule.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (schedule.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Past dates
  if (diffDays < 0) {
    return '#AC0003';
  }

  // Future dates (tomorrow and beyond)
  if (diffDays > 0) {
    return '#000000';
  }

  // ----------------------
  // Today's orders
  // ----------------------

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let alertStart = 0;
  let slotEnd = 0;

  switch (item.sheduleTime) {
    case '8AM - 12PM':
      alertStart = 7 * 60 + 15;   
      slotEnd = 12 * 60;          
      break;

    case '12PM - 4PM':
      alertStart = 11 * 60 + 15;  
      slotEnd = 16 * 60;          
      break;

    case '4PM - 9PM':
      alertStart = 15 * 60 + 15;  
      slotEnd = 21 * 60;          
      break;

    default:
      return '#000000';
  }

  // Before alert window
  if (currentMinutes < alertStart) {
    return '#000000';
  }

  // During alert window
  if (currentMinutes <= slotEnd) {
    return '#FF0000';
  }

  // After the slot has ended
  return '#AC0003';
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
      return schedule.toLocaleDateString('en-CA').replace(/-/g, '/'); 
      // Formats as YYYY/MM/DD
    }
  }

  removeWithin(time: string): string {
    return time ? time.replace('Within ', '') : time;
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
  complainCategory!: string
  sheduleDate!: Date
  sheduleTime!: string
  packagePackStatus!: string
  status!: string
  officerId!: number
  firstNameEnglish!: string
  lastNameEnglish!: string
  combinedStatus!: string
}

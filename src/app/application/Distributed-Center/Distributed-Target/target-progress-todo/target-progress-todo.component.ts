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
  selectType: string = '';
  selectTimeSlot: string = '';
    selectRow!: number | null;
      rowDropdownOptions: number[] = [];
  rowIndexes: number[] = [];

  

  date:  string = '';

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  isLoading:boolean = true;

  isStatusDropdownOpen = false;
  isTypeDropdownOpen = false;
  isTimeSlotDropdownOpen = false;
  typeDropdownOptions = ['Pickup', 'Delivery'];
  timeSlotDropdownOptions = ['08:00 AM - 12:00 PM', '12:00 PM - 04:00 PM', '04:00 PM - 09:00 PM'];
  statusDropdownOptions = ['Pending', 'Opened'];

    isRowDropdownOpen = false;

  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  selectStatusOption(option: string) {
    this.selectStatus = option;
    this.isStatusDropdownOpen = false;
    this.filterStatus();
  }

  toggleTypeDropdown() {
    this.isTypeDropdownOpen = !this.isTypeDropdownOpen;
  }

  selectTypeOption(option: string) {
    this.selectType = option;
    this.isTypeDropdownOpen = false;
    this.filterType();
  }


  toggleTimeSlotDropdown() {
    this.isTimeSlotDropdownOpen = !this.isTimeSlotDropdownOpen;
  }

  selectTimeSlotOption(option: string) {
    this.selectTimeSlot = option;
    this.isTimeSlotDropdownOpen = false;
    this.filterTimeSlot();
  }

    toggleRowDropdown() {
    this.isRowDropdownOpen = !this.isRowDropdownOpen;
  }

  selectRowOption(option: number) {
    this.selectRow = option;
    this.isRowDropdownOpen = false;
    this.filterRow();
  }

  constructor(
    private router: Router,
    private ComplainSrv: ComplaintsService,
    private DistributionSrv: DistributionServiceService
  ) { }


  ngOnInit(): void {
    this.fetchToDoAssignOrders();
  }

  fetchToDoAssignOrders(status: string = this.selectStatus, search: string = this.searchText, selectDate: string = this.date, type: string = this.selectType, timeSlot: string = this.selectTimeSlot, row: number | null = this.selectRow) {
    this.isLoading = true;
    this.DistributionSrv.getToDoAssignOrders(status, search, selectDate, type, timeSlot, row).subscribe(
      (res) => {

        this.totalItems = res.items.length;
        this.ordersArr = res.items
        this.rowIndexes = res.rowIndexes;
        this.rowDropdownOptions = this.rowIndexes
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

  filterType() {
    this.fetchToDoAssignOrders();
  }

  cancelType(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectType = '';
    this.fetchToDoAssignOrders();
  }

  filterTimeSlot() {
    this.fetchToDoAssignOrders();
  }

  cancelTimeSlot(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectTimeSlot = '';
    this.fetchToDoAssignOrders();
  }

  filterRow() {
    this.fetchToDoAssignOrders();
  }

  cancelRow(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectRow = null;
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

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let alertStart = 0;
  let slotEnd = 0;

  switch (item.sheduleTime) {
    case '08:00 AM - 12:00 PM':
      alertStart = 7 * 60 + 15;   
      slotEnd = 12 * 60;          
      break;

    case '12:00 PM - 04:00 PM':
      alertStart = 11 * 60 + 15;  
      slotEnd = 16 * 60;          
      break;

    case '04:00 PM - 09:00 PM':
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
  rowIndex!: number
  invNo!: string
  sheduleDate!: Date
  sheduleTime!: string
    delivaryMethod!: string;
  combinedStatus!: string
}

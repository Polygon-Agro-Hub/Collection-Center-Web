import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';
import { CustomDatepickerComponent } from "../../../../components/custom-datepicker/custom-datepicker.component";
import Swal from 'sweetalert2';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-target-progress-ongoing',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent, CustomDatepickerComponent],
  templateUrl: './target-progress-ongoing.component.html',
  styleUrl: './target-progress-ongoing.component.css'
})
export class TargetProgressOngoingComponent implements OnInit {

  ordersArr!: orders[];
  searchText: string = '';
  selectStatus: string = '';
  selectType: string = '';
  selectTimeSlot: string = '';
  selectRow!: number | null;
  centerName!: string;
  selectedDate: string | Date | null = null;
  totalItems: number = 0;
  hasData: boolean = true;
  isLoading:boolean = false;
  isStatusDropdownOpen = false;
  isTypeDropdownOpen = false;
  isTimeSlotDropdownOpen = false;
  isRowDropdownOpen = false;
  statusDropdownOptions = ['Pending', 'Completed', 'Opened'];
  typeDropdownOptions = ['Pickup', 'Delivery'];
  timeSlotDropdownOptions = ['08:00 AM - 12:00 PM', '12:00 PM - 04:00 PM', '04:00 PM - 09:00 PM'];
  isDownloading = false;
  rowDropdownOptions: number[] = [];
  rowIndexes: number[] = [];

  centerId: number | null = null;
  selectedCenterName: string | null = null;
  regCode: string | null = null;
  tab!: string;

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
    private DistributionSrv: DistributionServiceService,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {

const segments = this.router.url.split('/');
this.tab = segments[1]
if (segments[1] === 'distribution-center') {
  this.centerId = Number(this.route.snapshot.paramMap.get('id'));
  this.selectedCenterName = this.route.snapshot.paramMap.get('centerName');
  this.regCode = this.route.snapshot.paramMap.get('regCode');
} else {
  this.centerId = null;
  this.selectedCenterName = null;
  this.regCode = null;
}

    this.fetchAllAssignOrders();
    if (segments[1] !== 'distribution-center') {
    this.fetchCenterData();
    }
  }

  fetchAllAssignOrders(status: string = this.selectStatus, search: string = this.searchText, selectDate: string | Date | null = this.selectedDate, type: string = this.selectType, timeSlot: string = this.selectTimeSlot, row: number | null = this.selectRow, centerId: number | null = this.centerId) {
    this.isLoading = true;
    this.DistributionSrv.getAllAssignOrders(status, search, selectDate, type, timeSlot, row, centerId).subscribe(
      (res) => {
        this.totalItems = res.items.length;
        this.ordersArr = res.items;
        this.rowIndexes = res.rowIndexes;
        this.rowDropdownOptions = this.rowIndexes
        this.hasData = res.items.length > 0;
        this.isLoading = false;
      }
    );
  }

  fetchCenterData() {
    this.isLoading = true;
    this.DistributionSrv.getCenterData().subscribe(
      (res) => {
        this.centerName = res?.centerName ?? '';
        const items = res?.items ?? []; // safe fallback
        this.totalItems = items.length;
        this.hasData = items.length > 0;
        this.isLoading = false;
      }
    );
  }
  
  onSearch() {
    this.searchText = this.searchText?.trim() || '';
    this.fetchAllAssignOrders();

  }

  offSearch() {
    this.searchText = '';
    this.fetchAllAssignOrders();
  }

  filterStatus() {
    this.fetchAllAssignOrders();
  }

  cancelStatus(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectStatus = '';
    this.fetchAllAssignOrders();
  }

  filterType() {
    this.fetchAllAssignOrders();
  }

  cancelType(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectType = '';
    this.fetchAllAssignOrders();
  }

  filterTimeSlot() {
    this.fetchAllAssignOrders();
  }

  cancelTimeSlot(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectTimeSlot = '';
    this.fetchAllAssignOrders();
  }


  filterRow() {
    this.fetchAllAssignOrders();
  }

  cancelRow(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectRow = null;
    this.fetchAllAssignOrders();
  }
  onDateChange(newDate: string | Date | null) {
    let dateString: string;
  
    if (!newDate) {
      
      dateString = '';
    } 
    else if (newDate instanceof Date) {
      
      dateString = newDate.toISOString().split('T')[0];
    } 
    else {
      
      dateString = newDate;
    }
  
    this.selectedDate = dateString;
    this.fetchAllAssignOrders();
  }

  navigateViewReply(id:number){
    this.router.navigate([`/cch-complaints/view-recive-reply/${id}`])
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

getDateColor(item: any): string {
  const now = new Date();
  const today = new Date(now);

  const scheduleDate = new Date(item.sheduleDate);

  // Normalize dates for comparison
  today.setHours(0, 0, 0, 0);
  scheduleDate.setHours(0, 0, 0, 0);

  const diffDays =
    (scheduleDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  const status = (item.combinedStatus || '').toLowerCase();

  // Completed is always black
  if (status === 'completed') {
    return '#000000';
  }

  // Past dates
  if (diffDays < 0) {
    return '#AC0003';
  }

  // Future dates
  if (diffDays > 0) {
    return '#000000';
  }

  // --------------------------
  // Today's orders
  // --------------------------

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let alertStart = 0;
  let slotEnd = 0;

  switch (item.sheduleTime) {
    case '08:00 AM - 12:00 PM':
      alertStart = 7 * 60 + 15;   // 7:15 AM
      slotEnd = 12 * 60;          // 12:00 PM
      break;

    case '12:00 PM - 04:00 PM':
      alertStart = 11 * 60 + 15;  // 11:15 AM
      slotEnd = 16 * 60;          // 4:00 PM
      break;

    case '04:00 PM - 09:00 PM':
      alertStart = 15 * 60 + 15;  // 3:15 PM
      slotEnd = 21 * 60;          // 9:00 PM
      break;

    default:
      return '#000000';
  }

  // Before alert window
  if (currentMinutes < alertStart) {
    return '#000000';
  }

  // During alert window
  if (currentMinutes >= alertStart && currentMinutes <= slotEnd) {
    return '#FF0000';
  }

  // After slot has ended
  return '#AC0003';
}
  
  removeWithin(time: string): string {
    return time ? time.replace('Within ', '') : time;
  }

  downloadTemplate1() {
    this.isDownloading = true;
    // Example: selectedDate = "2025-11-10" or "11/10/2025"
    const selectedDateStr = String(this.selectedDate); 
    // Convert safely to Date
    const selectedDateObj = new Date(selectedDateStr);
    // Example: "10 Nov"
    function getOrdinal(day: number): string {
      if (day > 3 && day < 21) return 'th';
    
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    }
    
    const day = selectedDateObj.getDate();
    const month = selectedDateObj.toLocaleString('en-GB', { month: 'long' });
    const year = selectedDateObj.getFullYear();
    const monthNumber = String(selectedDateObj.getMonth() + 1).padStart(2, '0');
    
    const dateStr = `${String(day).padStart(2, '0')}${getOrdinal(day)} ${month} ${year}`;
  
    const fullDateStr = `${String(selectedDateObj.getMonth() + 1).padStart(2, '0')}-${String(selectedDateObj.getDate()).padStart(2, '0')}`;
    const now = new Date();

// use TODAY for "Generated at"
const genDay = now.getDate();
const genMonthNumber = String(now.getMonth() + 1).padStart(2, '0');
const genYear = now.getFullYear();

const timeStr = now
  .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  .replace(':', '.')
  .replace(' ', '');

const generatedAtStr = `${genDay}/${genMonthNumber}/${genYear} ${timeStr}`;

    this.DistributionSrv
      .downloadAllTargetProgressReport(this.selectStatus, this.selectedDate, this.searchText, this.selectType, this.selectRow, this.selectTimeSlot )
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          const activeFilters: string[] = [];
          if (this.selectStatus) activeFilters.push(this.selectStatus);
          if (this.selectType) activeFilters.push(this.selectType);
          if (this.selectTimeSlot) activeFilters.push(this.selectTimeSlot);
          if (this.selectRow) activeFilters.push(`Row ${this.selectRow}`);

          const filterStr = activeFilters.length ? ` filtered by ${activeFilters.join(', ')}` : '';
          const dateSegment = this.selectedDate ? ` on ${dateStr}` : '';

          a.download = `${this.centerName} All Orders${dateSegment}${filterStr} Generated at ${generatedAtStr}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);

          this.toastSrv.success('File Downloaded Successfully.');
          this.isDownloading = false;
        },
        error: (error) => {
        
        this.toastSrv.error('File Download Failed.');
          this.isDownloading = false;
        }
      });
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


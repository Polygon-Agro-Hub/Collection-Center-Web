import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';

@Component({
  selector: 'app-target-progress-ongoing',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './target-progress-ongoing.component.html',
  styleUrl: './target-progress-ongoing.component.css'
})
export class TargetProgressOngoingComponent implements OnInit {

  ordersArr!: orders[];
  searchText: string = '';
  selectStatus: string = '';

  selectedDate: string | Date | null = null;

  // page: number = 1;
  totalItems: number = 0;
  // itemsPerPage: number = 10;
  hasData: boolean = true;

  isLoading:boolean = true;

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Pending', 'Completed', 'Opened'];



  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  selectStatusOption(option: string) {
    this.selectStatus = option;
    this.isStatusDropdownOpen = false;
    this.filterStatus();
  }

  showCalendar = false;

  currentMonth: number;
  currentYear: number;
  calendarDays: { date: number; currentMonth: boolean; fullDate: Date }[] = [];

  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];


  constructor(
    private router: Router,
    private ComplainSrv: ComplaintsService,
    private DistributionSrv: DistributionServiceService
  ) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateCalendar(this.currentMonth, this.currentYear);
   }


  ngOnInit(): void {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
    this.fetchAllAssignOrders();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const statusDropdownElement = document.querySelector('.custom-status-dropdown-container');
    const statusDropdownClickedInside = statusDropdownElement?.contains(event.target as Node);

    if (!statusDropdownClickedInside && this.isStatusDropdownOpen) {
      this.isStatusDropdownOpen = false;
    }

  }

  fetchAllAssignOrders(status: string = this.selectStatus, search: string = this.searchText, selectDate: string | Date | null = this.selectedDate) {
    this.isLoading = true;
    this.DistributionSrv.getAllAssignOrders(status, search, selectDate).subscribe(
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

  // onDateChange() {
  //   console.log('called')
  //   this.fetchAllAssignOrders();
  // }

  // clearDate() {
  //   this.date = null;
  // }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  clearDate(event: Event) {
    event.stopPropagation();
    this.selectedDate = '';
    this.fetchAllAssignOrders();
  }


  selectDate(day: any) {
    const d = day.fullDate;
  
    // build YYYY-MM-DD manually in local time
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
  
    this.selectedDate = `${year}-${month}-${date}`; // → "2025-08-29"
    console.log('selectedDate', this.selectedDate);
    this.fetchAllAssignOrders();
    this.showCalendar = false;
    
  }
  

  isSelected(day: any): boolean {
    if (!this.selectedDate) return false;
  
    const d = day.fullDate;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    const dayStr = `${year}-${month}-${date}`;
  
    return this.selectedDate === dayStr;
  }
  

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  generateCalendar(month: number, year: number) {
    this.calendarDays = [];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Fill previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      this.calendarDays.push({
        date: prevMonthDays - i,
        currentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthDays - i)
      });
    }

    // Fill current month days
    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push({
        date: i,
        currentMonth: true,
        fullDate: new Date(year, month, i)
      });
    }

    // Fill next month to complete 6 rows (42 cells)
    while (this.calendarDays.length < 42) {
      const nextDate = this.calendarDays.length - (firstDay + daysInMonth) + 1;
      this.calendarDays.push({
        date: nextDate,
        currentMonth: false,
        fullDate: new Date(year, month + 1, nextDate)
      });
    }
  }


  // onPageChange(event: number) {
  //   this.page = event;
  //   this.fetchAllAssignOrders(this.page, this.itemsPerPage);
  // }

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

  removeWithin(time: string): string {
    return time ? time.replace('Within ', '') : time;
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


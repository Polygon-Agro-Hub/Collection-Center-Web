import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-target-out-for-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './target-out-for-delivery.component.html',
  styleUrl: './target-out-for-delivery.component.css'
})
export class TargetOutForDeliveryComponent implements OnInit {
  ordersArr!: orders[];
  searchText: string = '';
  selectStatus: string = '';

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;
  centerName!: string;

  isLoading:boolean = true;

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Late', 'On Time'];

  isDownloading = false;

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
    this.fetchOutForDeliveryOrders();
  }

  fetchOutForDeliveryOrders(status: string = this.selectStatus, search: string = this.searchText) {
    this.isLoading = true;
    this.DistributionSrv.getOutForDeliveryOrders(status, search).subscribe(
      (res) => {
        this.ordersArr = res.items
        console.log('ordersArr', this.ordersArr)
        this.centerName = res.centerName;
        this.totalItems = res.items.length | 0;
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
    this.searchText = this.searchText.trimStart();
    this.fetchOutForDeliveryOrders();
  }

  offSearch() {
    this.searchText = '';
    this.fetchOutForDeliveryOrders();

  }

  filterStatus() {
    this.fetchOutForDeliveryOrders();
  }

  cancelStatus(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.selectStatus = '';
    this.fetchOutForDeliveryOrders();
  }

  onDateChange() {
    this.fetchOutForDeliveryOrders();
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

  downloadTemplate1() {
    this.isDownloading = true;
  
    const now = new Date();
    const selectedDateStr = String(now); 
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

// Example: "10/11" → convert to "10-11" (safe for filenames)
const fullDateStr = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
// Example: "12.41PM"
const timeStr = now
  .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  .replace(':', '.')
  .replace(' ', '');

// Combine → "10-11 12.41PM"
const finalStr = `${fullDateStr} ${timeStr}`;
    this.DistributionSrv
      .downloadOutForDeliveryTargetProgressReport(this.selectStatus, this.searchText)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
  
          if (this.selectStatus) {
            a.download = `${this.centerName} OFH Orders on ${dateStr} filtered by ${this.selectStatus} Generated at ${day}/${monthNumber}/${year} ${timeStr}.xlsx`;
          } else {
            a.download = `${this.centerName} OFH Orders on ${dateStr} Generated at ${day}/${monthNumber}/${year} ${timeStr}.xlsx`;
          }
  
          a.click();
          window.URL.revokeObjectURL(url);
  
          Swal.fire({
            icon: "success",
            title: "Downloaded",
            text: "File Downloaded Successfully",
            customClass: {
              popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
              title: 'dark:text-white',
            }
          });
          this.isDownloading = false;
        },
        error: (error) => {
          Swal.fire({
            icon: "error",
            title: "Download Failed",
            text: error.message,
            customClass: {
              popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
              title: 'dark:text-white',
            }
          });
          this.isDownloading = false;
        }
      });
  }

  getStatus(item: orders): string {
    // Convert both into Date objects
    const scheduleDate = new Date(item.sheduleDate);
    const outDlvrDateLocal = item.outDlvrDateLocal ? new Date(item.outDlvrDateLocal) : null;
  
    // Create the schedule deadline
    const deadline = new Date(scheduleDate);
  
    if (item.sheduleTime) {
      const timeSlot = item.sheduleTime.trim();
  
      if (timeSlot === 'Within 8-12 PM') {
        deadline.setHours(12, 0, 0, 0); // 12:00 PM
      } else if (timeSlot === 'Within 12-4 PM') {
        deadline.setHours(16, 0, 0, 0); // 4:00 PM
      } else if (timeSlot === 'Within 4-8 PM') {
        deadline.setHours(20, 0, 0, 0); // 8:00 PM
      }
    }
  
    // Current time in SL
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })
    );

    // --- Case 1: Not completed yet ---
    if (outDlvrDateLocal) {
      if (outDlvrDateLocal.getTime() > deadline.getTime()) {
        // this.isLateAndNotCompleted = true;
        return 'Late';
      } else if (outDlvrDateLocal.getTime() <= deadline.getTime()){
        return 'On Time';
      }
    }
  
    return 'Unknown';
  }

  getTimeValidity(item: orders): string {
    const scheduleDate = new Date(item.sheduleDate);
  
    // Get current date in Asia/Colombo
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })
    );
  
    // Compare only the date part (ignore time)
    const scheduleDateOnly = new Date(
      scheduleDate.getFullYear(),
      scheduleDate.getMonth(),
      scheduleDate.getDate()
    );
  
    const currentDateOnly = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
  
    if (scheduleDateOnly.getTime() === currentDateOnly.getTime()) {
      return 'Equal';
    } else if (scheduleDateOnly.getTime() < currentDateOnly.getTime()) {
      return 'Passed';
    } else {
      return 'Not Passed';
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
  outDlvrDateLocal!: Date
  deliveryPeriod!: string
  scheduleDateStatus!: string
  outDlvrDate!: Date;
}


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
    this.fetchCenterData();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const statusDropdownElement = document.querySelector('.custom-status-dropdown-container');
    const statusDropdownClickedInside = statusDropdownElement?.contains(event.target as Node);

    if (!statusDropdownClickedInside && this.isStatusDropdownOpen) {
      this.isStatusDropdownOpen = false;
    }

  }

  fetchOutForDeliveryOrders(status: string = this.selectStatus, search: string = this.searchText) {
    this.isLoading = true;
    this.DistributionSrv.getOutForDeliveryOrders(status, search).subscribe(
      (res) => {
        console.log('res', res)
        this.ordersArr = res.items
        console.log('ordersArr', this.ordersArr)
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

  fetchCenterData() {
    this.isLoading = true;
    this.DistributionSrv.getCenterData().subscribe(
      (res) => {
        console.log('res', res)
        this.centerName = res.centerName
        console.log('ordersArr', this.ordersArr)
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
    console.log('called')
    this.fetchOutForDeliveryOrders();
  }


  // onPageChange(event: number) {
  //   this.page = event;
  //   this.fetchOutForDeliveryOrders(this.page, this.itemsPerPage);
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

  downloadTemplate1() {
    this.isDownloading = true;
  
    const now = new Date();

    const day = now.getDate();        // 1–31
    const month = now.getMonth() + 1;

// Example: "10 Nov"
const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

// Example: "10/11" → convert to "10-11" (safe for filenames)
const fullDateStr = now
  .toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })
  .replace(/\//g, '-');

// Example: "12.41PM"
const timeStr = now
  .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  .replace(':', '.')
  .replace(' ', '');

// Combine → "10-11 12.41PM"
const finalStr = `${fullDateStr} ${timeStr}`;
console.log(finalStr);
  
    this.DistributionSrv
      .downloadOutForDeliveryTargetProgressReport(this.selectStatus, this.searchText)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
  
          if (this.selectStatus) {
            a.download = `${this.centerName} OFD Orders on ${dateStr} filtered by ${this.selectStatus} Generated at ${finalStr}.xlsx`;
          } else {
            a.download = `${this.centerName} OFD Orders on ${dateStr} Generated at $${finalStr}.xlsx`;
          }
  
          a.click();
          window.URL.revokeObjectURL(url);
  
          Swal.fire({
            icon: "success",
            title: "Downloaded",
            text: "Please check your downloads folder",
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
}


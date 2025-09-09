import { CommonModule, DatePipe, Location  } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DistributionServiceService } from '../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { CustomDatepickerComponent } from "../../../components/custom-datepicker/custom-datepicker.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dch-center-target-out-for-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent, CustomDatepickerComponent],
  templateUrl: './dch-center-target-out-for-delivery.component.html',
  styleUrl: './dch-center-target-out-for-delivery.component.css'
})
export class DchCenterTargetOutForDeliveryComponent implements OnInit{

  ordersArr!: orders[];
  searchText: string = '';
  selectStatus: string = '';

  totalOfficers: number = 0;

  officerId!: number;

  date:  string | Date | null = null;

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  centerId: number | null = null;
  centerName: string | null = null;
  regCode: string | null = null;

  isLoading:boolean = true;

  isDownloading: boolean = false;

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Late', 'On Time'];

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
    private DistributionSrv: DistributionServiceService,
    private location: Location,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.centerId = Number(this.route.snapshot.paramMap.get('id'));
    this.centerName = String(this.route.snapshot.paramMap.get('centerName'));
    this.regCode = String(this.route.snapshot.paramMap.get('regCode'));
    console.log('centerId', this.centerId)

    const today = new Date();
    this.date = today.toISOString().split('T')[0];
    this.fetchCenterTargetOutForDelivery();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const statusDropdownElement = document.querySelector('.custom-status-dropdown-container');
    const statusDropdownClickedInside = statusDropdownElement?.contains(event.target as Node);

    if (!statusDropdownClickedInside && this.isStatusDropdownOpen) {
      this.isStatusDropdownOpen = false;
    }

  }

  fetchCenterTargetOutForDelivery(centerId: number = this.centerId!, search: string = this.searchText, status: string = this.selectStatus, selectDate: string | Date | null = this.date) {
    console.log('selectDate', selectDate)
    this.isLoading = true;
    this.DistributionSrv.getCenterTargetForDelivery(centerId, search, status, selectDate).subscribe(
      (res) => {
        this.ordersArr = res.items
        console.log('orders', this.ordersArr)
        this.totalItems = res.total;
        
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
    if (this.searchText) {
      this.searchText = this.searchText.trim();
    }
    this.fetchCenterTargetOutForDelivery();

  }

  offSearch() {
    this.searchText = '';
    this.fetchCenterTargetOutForDelivery();

  }

  // onDateChange() {
  //   console.log('called')
  //   this.fetchCenterTargetOutForDelivery();
  // }
  

  onDateChange(newDate: string | Date | null) {
    this.date = newDate;
    this.fetchCenterTargetOutForDelivery();
  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchCenterTargetOutForDelivery();
  }

  getDisplayDate(scheduleDate: string | Date): string {
    const today = new Date();
    const schedule = new Date(scheduleDate);
  
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
      const day = schedule.getDate();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[schedule.getMonth()];
  
      // Get ordinal for the day
      const ordinal = (n: number) => {
        if (n > 3 && n < 21) return 'th';
        switch (n % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      }
  
      return `${day}${ordinal(day)} ${month}`;
    }
  }

  downloadTemplate1() {
    this.isDownloading = true;

    this.DistributionSrv
      .downloadDCHOutForDeliveryTargetProgressReport(this.selectStatus, this.date, this.searchText, this.centerId! )
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `DCH-Out_For_Delivery_Report${this.date}.xlsx`;
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
  
  

  removeWithin(time: string): string {
    return time ? time.replace('Within ', '') : time;
  }


filterStatus() {
  this.fetchCenterTargetOutForDelivery();
}

cancelStatus(event?: MouseEvent) {
  if (event) {
    event.stopPropagation(); // Prevent triggering the dropdown toggle
  }
  this.selectStatus = '';
  this.fetchCenterTargetOutForDelivery();
}


goBack() {
  this.location.back();
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
  outDlvrDate!: Date
}


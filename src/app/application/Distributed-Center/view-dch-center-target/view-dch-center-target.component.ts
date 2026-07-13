import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DistributionServiceService } from '../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { CustomDatepickerComponent } from "../../../components/custom-datepicker/custom-datepicker.component";

@Component({
  selector: 'app-view-dch-center-target',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent, CustomDatepickerComponent],
  templateUrl: './view-dch-center-target.component.html',
  styleUrl: './view-dch-center-target.component.css'
})
export class ViewDchCenterTargetComponent implements OnInit {

  ordersArr!: orders[];
  searchText: string = '';
  selectStatus: string = '';

  officersArr!: Officer[];

  totalOfficers: number = 0;

  officerId!: number;

  date: string | Date | null = null;
  totalItems: number = 0;
  hasData: boolean = true;

  centerId: number | null = null;
  centerName: string | null = null;
  regCode: string | null = null;

  isLoading: boolean = true;

  isTarget: boolean = false;

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
    const today = new Date();
    this.date = today.toISOString().split('T')[0];
    this.fetchCenterTarget();
  }

  fetchCenterTarget(centerId: number = this.centerId!, search: string = this.searchText, status: string = this.selectStatus, selectDate: string | Date | null = this.date) {
    this.isLoading = true;
    this.DistributionSrv.getCenterTarget(centerId, search, status, selectDate).subscribe(
      (res) => {
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
        this.totalItems = res.total;
        this.hasData = this.ordersArr.length > 0;
        if (this.selectStatus === '' && this.hasData) {
          this.isTarget = true;
        }
        this.isLoading = false;
      }
    )
  }

  fetchOfficers() {
    this.isLoading = true;
    this.DistributionSrv.getOfficers().subscribe(
      (res) => {
        this.officersArr = res
        this.totalOfficers = res.length;
        this.isLoading = false;

      }
    )
  }

  onSearch() {
    if (this.searchText) {
      this.searchText = this.searchText.trim();
    }
    this.fetchCenterTarget();
  }

  offSearch() {
    this.searchText = '';
    this.fetchCenterTarget();

  }

  onDateChange(newDate: string | Date | null) {
    this.date = newDate;
    this.isTarget = false;
    this.fetchCenterTarget();
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



  getScheduleDateColor(
    scheduleDate: string | Date,
    sheduleTime: string,
    combinedStatus: string
  ): string {

    // Completed is always black/default
    if (combinedStatus?.toLowerCase() === 'completed') {
      return 'text-gray-900 dark:text-[#C5C5C5]';
    }

    const now = new Date();

    const today = new Date(now);
    const schedule = new Date(scheduleDate);

    today.setHours(0, 0, 0, 0);
    schedule.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (schedule.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Past dates
    if (diffDays < 0) {
      return 'text-[#AC0003]';
    }

    // Future dates
    if (diffDays > 0) {
      return 'text-gray-900 dark:text-[#C5C5C5]';
    }

    // ----------------------
    // Today's orders
    // ----------------------

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let alertStart = 0;
    let slotEnd = 0;

    switch (sheduleTime) {
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
        return 'text-gray-900 dark:text-[#C5C5C5]';
    }

    // Before alert window
    if (currentMinutes < alertStart) {
      return 'text-gray-900 dark:text-[#C5C5C5]';
    }

    // During alert window
    if (currentMinutes <= slotEnd) {
      return 'text-[#FF0000]';
    }

    // After slot
    return 'text-[#AC0003]';
  }

  removeWithin(time: string): string {
    return time ? time.replace('Within ', '') : time;
  }


  filterStatus() {
    this.fetchCenterTarget();
  }

  cancelStatus(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectStatus = '';
    this.fetchCenterTarget();
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
  sheduleDate!: Date
  sheduleTime!: string
  packagePackStatus!: string
  status!: string
  officerId!: number
  empId!: string
  firstNameEnglish!: string
  lastNameEnglish!: string
  outDlvrDateLocal!: string
  distributedTargetId!: number
  combinedStatus!: string
}

class Officer {
  id!: number;
  empId!: string;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
  ordersCount!: number;
}

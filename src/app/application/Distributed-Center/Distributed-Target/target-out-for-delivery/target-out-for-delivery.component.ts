import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';
import Swal from 'sweetalert2';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';
import { CustomDatepickerComponent } from "../../../../components/custom-datepicker/custom-datepicker.component";


@Component({
  selector: 'app-target-out-for-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent, CustomDatepickerComponent],
  templateUrl: './target-out-for-delivery.component.html',
  styleUrl: './target-out-for-delivery.component.css'
})
export class TargetOutForDeliveryComponent implements OnInit {
  ordersArr!: orders[];
  searchText: string = '';
  selectStatus: string = '';
  selectType: string = '';
  selectTimeSlot: string = '';
  selectRow!: number | null;
    selectedDate: string | Date | null = null;

    rowDropdownOptions: number[] = [];
  rowIndexes: number[] = [];
  processOrder = new ProcessOrder();

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;
  centerName!: string;

  isLoading:boolean = true;

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Late', 'On Time'];
  isTypeDropdownOpen = false;
  isTimeSlotDropdownOpen = false;
  isRowDropdownOpen = false;
  typeDropdownOptions = ['Pickup', 'Delivery'];
  timeSlotDropdownOptions = ['08:00 AM - 12:00 PM', '12:00 PM - 04:00 PM', '04:00 PM - 09:00 PM'];

    centerId: number | null = null;
  selectedCenterName: string | null = null;
  regCode: string | null = null;
  tab!: string;

  isDownloading = false;
    listView: boolean = true;

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
            console.log('centerId1', this.centerId)

const segments = this.router.url.split('/');
this.tab = segments[1]
console.log('segments', segments[1])

if (segments[1] === 'distribution-center') {
  this.centerId = Number(this.route.snapshot.paramMap.get('id'));
  this.selectedCenterName = this.route.snapshot.paramMap.get('centerName');
  this.regCode = this.route.snapshot.paramMap.get('regCode');
} else {
  this.centerId = null;
  this.selectedCenterName = null;
  this.regCode = null;
}

    this.fetchOutForDeliveryOrders();
  }

  fetchOutForDeliveryOrders(status: string = this.selectStatus, search: string = this.searchText, type: string = this.selectType, timeSlot: string = this.selectTimeSlot, row: number | null = this.selectRow, selectDate: string | Date | null = this.selectedDate, centerId: number | null = this.centerId) {
    this.isLoading = true;
    this.DistributionSrv.getOutForDeliveryOrders(status, search, type, timeSlot, row, selectDate, centerId).subscribe(
      (res) => {
        this.ordersArr = res.items
        console.log('ordersArr', this.ordersArr)
        this.rowIndexes = res.rowIndexes;
        this.rowDropdownOptions = this.rowIndexes
        console.log('rowIndexes', this.rowIndexes)
        this.centerName = res.centerName;
        this.totalItems = res.items.length | 0;
                this.listView = true;
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

  filterType() {
    this.fetchOutForDeliveryOrders();
  }

  cancelType(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectType = '';
    this.fetchOutForDeliveryOrders();
  }

  filterTimeSlot() {
    this.fetchOutForDeliveryOrders();
  }

  cancelTimeSlot(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectTimeSlot = '';
    this.fetchOutForDeliveryOrders();
  }


  filterRow() {
    this.fetchOutForDeliveryOrders();
  }

  cancelRow(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectRow = null;
    this.fetchOutForDeliveryOrders();
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

  getOrdinalDay(date: Date | string | null | undefined): string {
    if (!date) return '';
    const day = new Date(date).getDate();
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1: return `${day}st`;
      case 2: return `${day}nd`;
      case 3: return `${day}rd`;
      default: return `${day}th`;
    }
  }

  downloadTemplate1() {
    this.isDownloading = true;

    const now = new Date();

    function getOrdinal(day: number): string {
      if (day > 3 && day < 21) return 'th';

      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    }

    const day = now.getDate();
    const year = now.getFullYear();
    const monthNumber = String(now.getMonth() + 1).padStart(2, '0');

    let dateStr = '';
    if (this.selectedDate) {
      const filterDate = new Date(this.selectedDate);
      const filterDay = filterDate.getDate();
      const filterMonth = filterDate.toLocaleString('en-GB', { month: 'long' });
      const filterYear = filterDate.getFullYear();
      dateStr = ` on ${String(filterDay).padStart(2, '0')}${getOrdinal(filterDay)} ${filterMonth} ${filterYear}`;
    }

    const timeStr = now
      .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      .replace(':', '.')
      .replace(' ', '');

    this.DistributionSrv
      .downloadOutForDeliveryTargetProgressReport(this.selectStatus, this.searchText, this.selectType, this.selectRow, this.selectTimeSlot, this.selectedDate)
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

          a.download = `${this.centerName} OFH Orders${dateStr}${filterStr} Generated at ${String(day).padStart(2, '0')}/${monthNumber}/${year} ${timeStr}.xlsx`;
  
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

  navigateViewReply(poId: number) {
    this.DistributionSrv.getOutForDeliveryOrderDeatils(poId).subscribe(
      (res) => {
        this.processOrder = res.items
        console.log('processOrder', this.processOrder)
        this.isLoading = false;
        this.listView = false;

        console.log('listView', this.listView, 'isLoading', this.isLoading)
      }
    )
    
  }

  goBack() {
    // this.location.back();
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
  rowIndex!: number;
  delivaryMethod!: string;
  packBy!: string;
  packTime!: Date;
}


export class ProcessOrder {
  processOrderId!: number;
  orderId!: number;
  invNo!: string;
  status!: string;
  delivaryMethod!: string;
  isPackage!: boolean;
  sheduleTime!: string;
  sheduleDate!: Date;
  packTime!: Date;
  qcDoneBy!: string;
    qrPrintTime!: Date;

  packages: OrderPackage[] = [];
  additionalItems: AdditionalItem[] = [];
}

export class OrderPackage {
  orderPackageId!: number;
  packageId!: number;
  packageName!: string;

  items: PackageItem[] = [];
}

export class PackageItem {
  productId!: number;
  productName!: string;
  image!: string;
  qty!: number;
  isPacked!: boolean;
  packingTime!: string | null;
  packedByOfficer!: string;
}

export class AdditionalItem {
  productId!: number;
  productName!: string;
  image!: string;
  qty!: number;
  unit!: string;
  isPacked!: boolean;
  packingTime!: string | null;
  packedByOfficer!: string;
}


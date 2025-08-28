import { CommonModule, DatePipe, Location  } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DistributionServiceService } from '../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-view-dch-center-target',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './view-dch-center-target.component.html',
  styleUrl: './view-dch-center-target.component.css'
})
export class ViewDchCenterTargetComponent implements OnInit{

  ordersArr!: orders[];
  searchText: string = '';
  selectStatus: string = '';

  officersArr!: Officer[];

  totalOfficers: number = 0;

  officerId!: number;

  date:  string = '';

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  centerId: number | null = null;
  centerName: string | null = null;
  regCode: string | null = null;

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
    this.fetchCenterTarget();
    this.fetchOfficers();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const statusDropdownElement = document.querySelector('.custom-status-dropdown-container');
    const statusDropdownClickedInside = statusDropdownElement?.contains(event.target as Node);

    if (!statusDropdownClickedInside && this.isStatusDropdownOpen) {
      this.isStatusDropdownOpen = false;
    }

  }

  fetchCenterTarget(centerId: number = this.centerId!, search: string = this.searchText, status: string = this.selectStatus, selectDate: string = this.date) {
    this.isLoading = true;
    console.log('selectStatus', this.selectStatus)
    this.DistributionSrv.getCenterTarget(centerId, search, status, selectDate ).subscribe(
      (res) => {
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
        
  
        console.log('ordersarr', this.ordersArr);
        this.totalItems = res.total;
  
        this.hasData = this.ordersArr.length > 0;
        this.isLoading = false;
      }
    )
  }

  fetchOfficers() {
    this.isLoading = true;
    this.DistributionSrv.getOfficers().subscribe(
      (res) => {
        console.log('officer', res)
        this.officersArr = res
        console.log('officersArr', this.officersArr)
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

  onDateChange() {
    console.log('called')
    this.fetchCenterTarget();
  }


  onPageChange(event: number) {
    this.page = event;
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

import { CommonModule, DatePipe, Location  } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DistributionServiceService } from '../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-officer-target-distribution',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './view-officer-target-distribution.component.html',
  styleUrl: './view-officer-target-distribution.component.css'
})
export class ViewOfficerTargetDistributionComponent implements OnInit {
  ordersArr!: orders[];
  searchText: string = '';
  selectStatus: string = '';

  isDownloading: boolean = false;

  centerName: string = '';
  empId: string = '';

  officersArr!: Officer[];

  totalOfficers: number = 0;
  officerId!: number;
  centerId!: number;

  date:  string = '';

  hasData: boolean = false;

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
    this.officerId = this.route.snapshot.params['officerId'];
    const nameParam = this.route.snapshot.params['centerName'];
    this.centerName =
    nameParam && nameParam !== 'null' && nameParam.trim() !== ''
      ? nameParam
      : null;
    this.centerId = this.route.snapshot.params['centerId'];
    this.empId = this.route.snapshot.params['empId']
    console.log('Selected officerId:', this.officerId);
    this.fetchOfficers();
    this.fetchSelectedOfficerTargets();
    
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const statusDropdownElement = document.querySelector('.custom-status-dropdown-container');
    const statusDropdownClickedInside = statusDropdownElement?.contains(event.target as Node);

    if (!statusDropdownClickedInside && this.isStatusDropdownOpen) {
      this.isStatusDropdownOpen = false;
    }

  }

  fetchSelectedOfficerTargets(
    officerId: number = this.officerId, 
    centerId: number = this.centerId,
    search: string = this.searchText, 
    status: string = this.selectStatus
  ) {
    this.isLoading = true;
    this.DistributionSrv.getSelectedDistributionOfficerTargets(officerId, centerId, search, status).subscribe(
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
        
  
        console.log('ordersarr', this.ordersArr);
  
        this.hasData = this.ordersArr.length > 0;
        this.isLoading = false;
      }
    );
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
    this.fetchSelectedOfficerTargets();

  }

  offSearch() {
    this.searchText = '';
    this.fetchSelectedOfficerTargets();

  }

  onDateChange() {
    console.log('called')
    this.fetchSelectedOfficerTargets();
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
  this.fetchSelectedOfficerTargets();
}

cancelStatus(event?: MouseEvent) {
  if (event) {
    event.stopPropagation(); // Prevent triggering the dropdown toggle
  }
  this.selectStatus = '';
  this.fetchSelectedOfficerTargets();
}

goBack() {
  this.location.back();
}

navigateToManageOfficers() {
  this.router.navigate(['/distribution-officers'])
}

getStatus(item: orders): string {
  if (!item.completeTime) {
    return 'Not Completed';
  }

  // Convert both into Date objects
  const completeTime = new Date(item.completeTime);
  const scheduleDate = new Date(item.sheduleDate);

  // Clone scheduleDate for deadline
  let deadline = new Date(scheduleDate);

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

  // --- Debug with Sri Lanka local time ---
  console.log(
    'Complete (SL):',
    completeTime.toLocaleString('en-GB', { timeZone: 'Asia/Colombo', hour12: false })
  );
  console.log(
    'Deadline (SL):',
    deadline.toLocaleString('en-GB', { timeZone: 'Asia/Colombo', hour12: false })
  );

  // ✅ Compare using timestamps (still works for SL)
  return completeTime.getTime() <= deadline.getTime() ? 'On Time' : 'Late';
}

downloadTemplate1() {
  this.isDownloading = true;
    this.DistributionSrv
    .downloadRequestedItemsReportFile(this.officerId, this.centerId, this.searchText, this.selectStatus)
    .subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${this.empId}_Current_active_officer_targets.xlsx`;
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
  completeTime!: Date
}

class Officer {
  id!: number;
  empId!: string;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
  ordersCount!: number;
}

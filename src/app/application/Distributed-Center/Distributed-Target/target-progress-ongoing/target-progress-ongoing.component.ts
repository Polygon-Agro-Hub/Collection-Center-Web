import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';
import { CustomDatepickerComponent } from "../../../../components/custom-datepicker/custom-datepicker.component";
import Swal from 'sweetalert2';

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
  centerName!: string;
  selectedDate: string | Date | null = null;
  totalItems: number = 0;
  hasData: boolean = true;
  isLoading:boolean = true;
  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Pending', 'Completed', 'Opened'];
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
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
    this.fetchAllAssignOrders();
    this.fetchCenterData();
  }

  fetchAllAssignOrders(status: string = this.selectStatus, search: string = this.searchText, selectDate: string | Date | null = this.selectedDate) {
    this.isLoading = true;
    this.DistributionSrv.getAllAssignOrders(status, search, selectDate).subscribe(
      (res) => {
        this.totalItems = res.items.length;
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

  onDateChange(newDate: string | Date | null) {
    let dateString: string;
  
    if (!newDate) {
      
      dateString = new Date().toISOString().split('T')[0];
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
    const today = new Date();
    const schedule = new Date(item.sheduleDate);
  
    // Normalize both to midnight
    today.setHours(0, 0, 0, 0);
    schedule.setHours(0, 0, 0, 0);
  
    const diffDays = Math.floor((schedule.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
    if (item.combinedStatus === 'Pending' || item.combinedStatus === 'Opened') {
      if (diffDays > 0) {
        // Future date
        return '#606060';
      } else if (diffDays < 0) {
        // Past date
        return '#AC0003';
      } else {
        // Today
        return '#FF0000';
      }
    }
  
    // Default color for Completed or other statuses
    return '#415CFF';
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
    const dateStr = selectedDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    // Example: "11-10" (MM-DD format)
    const fullDateStr = `${String(selectedDateObj.getMonth() + 1).padStart(2, '0')}-${String(selectedDateObj.getDate()).padStart(2, '0')}`;
    const now = new Date();
    const timeStr = now
      .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      .replace(':', '.')
      .replace(' ', '');

    const finalStr = `${fullDateStr} ${timeStr}`;
    this.DistributionSrv
      .downloadAllTargetProgressReport(this.selectStatus, this.selectedDate, this.searchText )
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          if (this.selectStatus) {
            a.download = `${this.centerName} All Orders on ${dateStr} filtered by ${this.selectStatus} Generated at ${finalStr}.xlsx`;
          } else {
            a.download = `${this.centerName} All Orders on ${dateStr}  Generated at ${finalStr}.xlsx`;
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


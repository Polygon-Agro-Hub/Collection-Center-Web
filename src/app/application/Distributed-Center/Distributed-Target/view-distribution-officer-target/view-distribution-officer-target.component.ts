import { CommonModule, DatePipe, Location  } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-view-distribution-officer-target',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './view-distribution-officer-target.component.html',
  styleUrl: './view-distribution-officer-target.component.css'
})
export class ViewDistributionOfficerTargetComponent implements OnInit {
  ordersArr!: orders[];
  searchText: string = '';
  selectStatus: string = '';

  officersArr!: Officer[];

  totalOfficers: number = 0;

  isPass: boolean = false;

  officerId!: number;

  date:  string = '';

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  isLoading:boolean = true;

  selectedOfficerId: number | '' = '';

  selectedOrderIds: number[] = []; 
  allChecked: boolean = false;
  
  filteredOrdersArr!: orders[] 

  isPassTarget = false;

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
    this.officerId = Number(this.route.snapshot.paramMap.get('officerId'));
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
    search: string = this.searchText, 
    status: string = this.selectStatus
  ) {
    this.isLoading = true;
    this.DistributionSrv.getSelectedOfficerTargets(officerId, search, status).subscribe(
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


  onPageChange(event: number) {
    this.page = event;
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

  isChecked(orderId: number): boolean {
    return this.selectedOrderIds.includes(orderId);
}


toggleOrder(orderId: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    
    if (isChecked) {
        if (!this.selectedOrderIds.includes(orderId)) {
            this.selectedOrderIds.push(orderId);
        }
    } else {
        this.selectedOrderIds = this.selectedOrderIds.filter(id => id !== orderId);
    }
    console.log('selectedOrderIds', this.selectedOrderIds);
    

    this.allChecked = this.selectedOrderIds.length === this.ordersArr.length;
}


toggleAllOrders(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.allChecked = isChecked;
    
    if (isChecked) {
      
        this.selectedOrderIds = this.ordersArr.map(item => item.processOrderId);
    } else {
        // Deselect all orders
        this.selectedOrderIds = [];
    }
    console.log('selectedOrderIds', this.selectedOrderIds)
}

deSelectAll() {
  this.selectedOrderIds = [];
  this.allChecked = false;
}

passTarget() {
  this.isPassTarget = true;
}

// PassTarget() {

//   const now = new Date();

// const year = now.getFullYear();
// const month = String(now.getMonth() + 1).padStart(2, '0');  // Months are 0-based
// const day = String(now.getDate()).padStart(2, '0');

// const hours = String(now.getHours()).padStart(2, '0');
// const minutes = String(now.getMinutes()).padStart(2, '0');
// const seconds = String(now.getSeconds()).padStart(2, '0');

// const currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

// console.log(currentTime);

//   if (this.allChecked) {
//     console.log('allcehcke');
//   } else {
//     console.log('count', this.selectedOrderIds.length);
//   }
//   console.log('currentTime', currentTime)

//   this.changeStatusAndTime({
//     orderIds: this.selectedOrderIds,
//     time: currentTime
//   });
// }

PassTarget() {
  this.isPass = true;
  this.isPassTarget = false;
  
  // Filter orders based on selectedOrderIds
  const filteredOrders = this.ordersArr.filter(order =>
    this.selectedOrderIds.includes(order.processOrderId)
  );

  console.log('selected po', this.selectedOrderIds);
  console.log('filtered orders', filteredOrders);

  // If you want to store it in another property
  this.filteredOrdersArr = filteredOrders;
  console.log('filteredOrdersArr', this.filteredOrdersArr)
}


changeStatusAndTime(data: { orderIds: any[]; time: string }) {
  this.isLoading = true;
  console.log('change status');
  

  this.DistributionSrv.setStatusAndTime(data).subscribe({
    next: (res) => {
      this.isLoading = false;

      if (res && res.success) {
        this.toastSrv.success(`${data.orderIds.length} orders have been sent out for delivery!`, 'Success');
        this.isPassTarget = false;
      } else {
        this.toastSrv.error('Failed to sent out for delivery!', 'Error');
        this.isPassTarget = false;
      }
      this.fetchSelectedOfficerTargets()
      this.allChecked = false;
    },
    error: (err) => {
      this.isLoading = false;
      console.error(err);
      this.toastSrv.error('Something went wrong!', 'Error');
      this.isPassTarget = false;
      this.fetchSelectedOfficerTargets()
      this.allChecked = false;
    }
  });
}

cancelPass() {
  this.isPassTarget = false;
}

cancell() {
  this.isPass = false;
}

passTargetToBackEnd() {
  console.log('orderIds', this.selectedOrderIds, 'distargetid', this.filteredOrdersArr[0].distributedTargetId, 'officer', this.selectedOfficerId, 'officerID', this.officerId )
  this.DistributionSrv.passTarget(this.selectedOrderIds, this.filteredOrdersArr[0].distributedTargetId, this.selectedOfficerId, this.officerId).subscribe(
    (res) => {
      console.log('respass', res)
      this.isLoading = false;
      if (res && res.status) {
        // Find the officer object with the selected ID
        const selectedOfficer = this.officersArr.find(
          officer => officer.id === this.selectedOfficerId
        );
      
        // Get the empId if officer exists
        const empId = selectedOfficer ? selectedOfficer.empId : 'Unknown';
      
        // Use empId in the toast message
        this.toastSrv.success(
          `${this.selectedOrderIds.length} orders have been passed to ${empId}!`,
          'Success'
        );
      
        this.isPass = false;
        this.isPassTarget = false;
        this.selectedOrderIds = [];
      }
       
      else {
        this.toastSrv.error('Failed to sent out for delivery!', 'Error');
        this.isPass = false;
      }
      this.fetchSelectedOfficerTargets()
      this.isPassTarget = false;
      this.allChecked = false;
      this.selectedOrderIds = [];
    }

  )
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


onOfficerChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  this.selectedOfficerId = selectElement.value ? Number(selectElement.value) : '';
  console.log('Selected Officer ID:', this.selectedOfficerId);
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


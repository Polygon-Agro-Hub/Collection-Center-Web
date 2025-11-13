import { CommonModule, DatePipe, Location  } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DistributionServiceService } from '../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';

@Component({
  selector: 'app-view-my-target-dcm',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent, SerchableDropdownComponent],
  templateUrl: './view-my-target-dcm.component.html',
  styleUrl: './view-my-target-dcm.component.css'
})
export class ViewMyTargetDcmComponent implements OnInit {
  ordersArr!: orders[];
  searchText: string = '';
  selectStatus: string = '';
  selectCompletingStatus: string = '';

  selectableOrders:  orders[] = [];
  isLateAndNotCompleted!: boolean;

  officersArr!: Officer[];

  totalOfficers: number = 0;

  isPass: boolean = false;

  officerId!: number;

  date:  string = '';

  hasData: boolean = true;

  isLoading:boolean = true;

  selectedOfficerId: number | '' = '';

  selectedOfficer: string = '';

  selectedEmpId!: string;

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

  isCompletingStatusDropdownOpen = false;
  completingStatusDropdownOptions = ['On Time', 'Late', 'Not Completed'];

  toggleCompletingStatusDropdown() {
    this.isCompletingStatusDropdownOpen = !this.isCompletingStatusDropdownOpen;
  }

  selectCompletingStatusOption(option: string) {
    this.selectCompletingStatus = option;
    this.isCompletingStatusDropdownOpen = false;
    this.filterCompletingStatus();
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
    this.officerId = Number(this.route.snapshot.paramMap.get('id'));
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
    status: string = this.selectStatus,
    completingStatus: string = this.selectCompletingStatus
  ) {
    this.isLoading = true;
    this.DistributionSrv.getSelectedOfficerTargets(officerId, search, status, completingStatus).subscribe(
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

        this.selectableOrders = this.ordersArr.filter(
          item => item.combinedStatus === 'Pending' && item.lockStatus !== 1
        );

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

  filterCompletingStatus() {
    this.fetchSelectedOfficerTargets();
  }
  
  cancelCompletingStatus(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectCompletingStatus = '';
    this.fetchSelectedOfficerTargets();
  }

  onSearch() {
    this.searchText = this.searchText.trimStart();
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

  // Only consider selectable items (Pending and not locked)
  
  this.allChecked = this.selectedOrderIds.length === this.selectableOrders.length;

  console.log('selectedOrderIds', this.selectedOrderIds);
  console.log('allChecked', this.allChecked);
}


toggleAllOrders(event: Event): void {
  const isChecked = (event.target as HTMLInputElement).checked;
  this.allChecked = isChecked;

  if (isChecked) {
    // Select only items that are not disabled (Pending and not locked)
    this.selectedOrderIds = this.ordersArr
      .filter(item => item.combinedStatus === 'Pending' && item.lockStatus !== 1)
      .map(item => item.processOrderId);
  } else {
    // Deselect all
    this.selectedOrderIds = [];
  }

  console.log('selectedOrderIds', this.selectedOrderIds);
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

        const orderCount = data.orderIds.length < 10 ? ('0' + data.orderIds.length) : (data.orderIds.length);
        const orderLabel = orderCount === 1 ? 'order' : 'orders';

        this.toastSrv.success(`${orderCount} ${orderLabel} successfully passed to ${this.selectedEmpId}!`, 'Success');
        this.isPassTarget = false;
      } else {
        this.toastSrv.error('Failed to pass the target to selected officer!', 'Error');
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
  if (!this.selectedOfficerId) {
    this.toastSrv.error('Please select a short stock assignee to pass the target!', 'Error');
    return; 
  }
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

        const orderCount = this.selectedOrderIds.length < 10 ? ('0' + this.selectedOrderIds.length) : (this.selectedOrderIds.length);
        const orderLabel = this.selectedOrderIds.length === 1 ? 'order' : 'orders';

        console.log('orderCount', orderCount, 'orderLabel', orderLabel )

        // Get the empId if officer exists
        const empId = selectedOfficer ? selectedOfficer.empId : 'Unknown';

        this.toastSrv.success(`${orderCount} ${orderLabel} successfully passed to ${empId}!`, 'Success');
        this.fetchSelectedOfficerTargets()
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


get categoryDropdownItems() {
  return this.officersArr
    .filter(officer => officer.id !== this.officerId) 
    .map(officer => ({
      value: officer.id.toString(),
      label: `${officer.empId} - ${officer.firstNameEnglish} ${officer.lastNameEnglish}`,
      disabled: false
    }));
}


// 5. Add selection change handler
onCategorySelectionChange(selectedValue: string) {
  this.selectedOfficer = selectedValue || '';

  this.selectedOfficerId = Number(this.selectedOfficer);

const passOfficer = this.officersArr.find(
  officer => officer.id === this.selectedOfficerId
);

this.selectedEmpId = passOfficer ? passOfficer.empId : '';
  // Add any additional logic you need when category changes
  console.log('officer selected:', this.selectedOfficerId);
}


onOfficerChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  this.selectedOfficerId = selectElement.value ? Number(selectElement.value) : '';
  console.log('Selected Officer ID:', this.selectedOfficerId);
}

goBack() {
  window.location.reload();
}

navigateToProfile() {
  this.router.navigate(['profile'])
}

getStatus(item: orders): string {
  console.log('Setting status');

  // Convert both into Date objects
  const scheduleDate = new Date(item.sheduleDate);
  const completeTime = item.completeTime ? new Date(item.completeTime) : null;

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

  console.log(
    'Now (SL):',
    now.toLocaleString('en-GB', { timeZone: 'Asia/Colombo', hour12: false })
  );
  console.log(
    'Deadline (SL):',
    deadline.toLocaleString('en-GB', { timeZone: 'Asia/Colombo', hour12: false })
  );

  // --- Case 1: Not completed yet ---
  if (!completeTime) {
    if (now.getTime() > deadline.getTime()) {
      this.isLateAndNotCompleted = true;
      return 'Not Completed';
    } else {
      this.isLateAndNotCompleted = false;
      return 'Not Completed';
    }
  }

  // --- Case 2: Completed: Check on-time or late ---
  return completeTime.getTime() <= deadline.getTime() ? 'On Time' : 'Late';
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
  lockStatus!: number
}

class Officer {
  id!: number;
  empId!: string;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
  ordersCount!: number;
}

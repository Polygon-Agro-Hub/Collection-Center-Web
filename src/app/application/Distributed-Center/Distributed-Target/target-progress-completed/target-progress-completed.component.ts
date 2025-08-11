import { CommonModule, DatePipe, Location  } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';

@Component({
  selector: 'app-target-progress-completed',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './target-progress-completed.component.html',
  styleUrl: './target-progress-completed.component.css'
})
export class TargetProgressCompletedComponent implements OnInit{
  ordersArr!: orders[];
  searchText: string = '';
  selectStatus: string = '';

  date:  string = '';

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  isLoading:boolean = true;

  selectedOrderIds: number[] = []; 
  allChecked: boolean = false; 

  isOutForDelivery = false;

  constructor(
    private router: Router,
    private ComplainSrv: ComplaintsService,
    private DistributionSrv: DistributionServiceService,
    private location: Location
  ) { }


  ngOnInit(): void {
    this.fetchCompletedAssignOrders();
  }

  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent) {
  //   const statusDropdownElement = document.querySelector('.custom-status-dropdown-container');
  //   const statusDropdownClickedInside = statusDropdownElement?.contains(event.target as Node);

  //   if (!statusDropdownClickedInside && this.isStatusDropdownOpen) {
  //     this.isStatusDropdownOpen = false;
  //   }

  // }

  fetchCompletedAssignOrders(page: number = 1, limit: number = this.itemsPerPage, search: string = this.searchText, selectDate: string = this.date) {
    this.isLoading = true;
    this.DistributionSrv.getCompletedAssignOrders(page, limit, search, selectDate).subscribe(
      (res) => {
        this.ordersArr = res.items
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
    this.fetchCompletedAssignOrders();

  }

  offSearch() {
    this.searchText = '';
    this.fetchCompletedAssignOrders();

  }

  onDateChange() {
    console.log('called')
    this.fetchCompletedAssignOrders();
  }


  onPageChange(event: number) {
    this.page = event;
    this.fetchCompletedAssignOrders(this.page, this.itemsPerPage);
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

outForDelivery() {
  this.isOutForDelivery = true
  if (this.allChecked) {
    console.log('allcehcke')
  } else {
     console.log('count', this.selectedOrderIds.length)
  }
}

cancelOutForDelivery() {
  window.history.back();
}

OutForDelivery() {

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
  firstNameEnglish!: string
  lastNameEnglish!: string
}

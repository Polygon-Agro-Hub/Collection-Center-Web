import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';

@Component({
  selector: 'app-target-progress-ongoing',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './target-progress-ongoing.component.html',
  styleUrl: './target-progress-ongoing.component.css'
})
export class TargetProgressOngoingComponent implements OnInit {

  ordersArr!: orders[];
  searchText: string = '';
  selectStatus: string = '';

  date:  string = '';

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

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
    private DistributionSrv: DistributionServiceService
  ) { }


  ngOnInit(): void {
    this.fetchAllAssignOrders();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const statusDropdownElement = document.querySelector('.custom-status-dropdown-container');
    const statusDropdownClickedInside = statusDropdownElement?.contains(event.target as Node);

    if (!statusDropdownClickedInside && this.isStatusDropdownOpen) {
      this.isStatusDropdownOpen = false;
    }

  }

  fetchAllAssignOrders(page: number = 1, limit: number = this.itemsPerPage, status: string = this.selectStatus, search: string = this.searchText) {
    this.isLoading = true;
    this.DistributionSrv.getAllAssignOrders(page, limit, status, search).subscribe(
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

  cancelViewReply() {
    this.isReplyView = false;
  }

  onSearch() {
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

  onDateChange() {
    console.log('called')
    this.fetchAllAssignOrders();
  }

  // cancelStatus() {
  //   this.selectStatus = '';
  //   this.fetchAllreciveComplaint();
  // }


  onPageChange(event: number) {
    this.page = event;
    this.fetchAllAssignOrders(this.page, this.itemsPerPage);
  }

  navigateViewReply(id:number){
    this.router.navigate([`/cch-complaints/view-recive-reply/${id}`])
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
}


import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DistributionComplaintsService } from '../../../services/distribution-complaints-service/distribution-complaints.service';

@Component({
  selector: 'app-dch-sent-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './dch-sent-complaints.component.html',
  styleUrl: './dch-sent-complaints.component.css'
})
export class DchSentComplaintsComponent implements OnInit{

  complainArr!: SentComplaint[];
  replyObj: Reply = new Reply();

  officerId!: number

  selectStatus: string = '';
  searchText: string = '';
  selectEmployee: string = '';
  isReplyView: boolean = false;


  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  isLoading: boolean = true;

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Opened', 'Closed'];

  expandedItems: { [key: number]: boolean } = {};

  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  selectStatusOption(option: string) {
    this.selectStatus = option;
    this.isStatusDropdownOpen = false;
    this.filterStatus();
  }

  isEmployeeDropdownOpen = false;
  employeeDropdownOptions = ['Own', 'Other'];

  toggleEmployeeDropdown() {
    this.isEmployeeDropdownOpen = !this.isEmployeeDropdownOpen;
  }

  selectEmployeeOption(option: string) {
    this.selectEmployee = option;
    this.isEmployeeDropdownOpen = false;
    this.filterEmployee();
  }


  constructor(
    private router: Router,
    private ComplainSrv: ComplaintsService,
    private DistributionComplaintsSrv: DistributionComplaintsService

  ) { }
  ngOnInit(): void {
    this.fetchAllreciveComplaint();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const statusDropdownElement = document.querySelector('.custom-status-dropdown-container');
    const statusDropdownClickedInside = statusDropdownElement?.contains(event.target as Node);

    if (!statusDropdownClickedInside && this.isStatusDropdownOpen) {
      this.isStatusDropdownOpen = false;
    }

    const employeeDropdownElement = document.querySelector('.custom-employee-dropdown-container');
    const employeeDropdownClickedInside = employeeDropdownElement?.contains(event.target as Node);

    if (!employeeDropdownClickedInside && this.isEmployeeDropdownOpen) {
      this.isEmployeeDropdownOpen = false;
    }

  }

  fetchAllreciveComplaint(page: number = 1, limit: number = this.itemsPerPage, status: string = this.selectStatus, emptype: string = this.selectEmployee, search: string = this.searchText) {
    this.isLoading = true;
    this.DistributionComplaintsSrv.getAllSentDCHComplains(page, limit, status, emptype, search).subscribe(
      (res) => {
        this.complainArr = res.items
        this.totalItems = res.total;
        this.officerId = res.userId
        if (res.items.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;

        }
        this.isLoading = false;


      }
    )
  }

  fetchGetReply(id: number) {
    this.isLoading = true;
    this.DistributionComplaintsSrv.dchGetComplainById(id).subscribe(
      (res) => {
        this.replyObj = res.data;
        this.isLoading = false;
      }
    )
  }

  filterStatus() {
    this.fetchAllreciveComplaint();
  }

  cancelStatus(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectStatus = '';
    this.fetchAllreciveComplaint();
  }

  // cancelStatus() {
  //   this.selectStatus = '';
  //   this.fetchAllreciveComplaint();
  // }

  filterEmployee() {
    this.fetchAllreciveComplaint();
  }

  cancelEmployee(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectEmployee = '';
    this.fetchAllreciveComplaint();
  }

  onSearch() {
    this.fetchAllreciveComplaint();

  }

  offSearch() {
    this.searchText = '';
    this.fetchAllreciveComplaint();

  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchAllreciveComplaint(this.page, this.itemsPerPage);
  }

  viewReply(id: number) {
    this.isReplyView = true;
    this.fetchGetReply(id);
  }

  cancelViewReply() {
    this.isReplyView = false;
  }

  truncateText(text: string, id: number, maxLength: number = 150): string {
    if (!text) return '';
    if (this.expandedItems[id]) return text;
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  toggleText(id: number): void {
    this.expandedItems[id] = !this.expandedItems[id];
  }


}


class SentComplaint {
  id!: number
  refNo!: string
  complainCategory!: string
  complain!: string
  status!: string
  empId!: string
  reply: string | null = null
  createdAt!: Date
  officerId!: number
}

class Reply {
  id!: number
  reply!: string
  language: string = 'English';
  firstNameEnglish!: string
  lastNameEnglish!: string
}

import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DistributionComplaintsService } from '../../../services/distribution-complaints-service/distribution-complaints.service';

@Component({
  selector: 'app-dcm-sent-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './dcm-sent-complaints.component.html',
  styleUrl: './dcm-sent-complaints.component.css'
})
export class DcmSentComplaintsComponent implements OnInit {

  complainArr!: SentComplaint[];
  replyObj: Reply = new Reply();
  templateData!: TemplateData;

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
    this.fetchAllDcmSentComplaint();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const statusDropdownElement = document.querySelector('.custom-status-dropdown-container');
    const statusDropdownClickedInside = statusDropdownElement?.contains(event.target as Node);

    const employeeDropdownElement = document.querySelector('.custom-employee-dropdown-container');
    const employeeDropdownClickedInside = employeeDropdownElement?.contains(event.target as Node);

    if (!statusDropdownClickedInside && this.isStatusDropdownOpen) {
      this.isStatusDropdownOpen = false;
    }

    if (!employeeDropdownClickedInside && this.isEmployeeDropdownOpen) {
      this.isEmployeeDropdownOpen = false;
    }

  }

  fetchAllDcmSentComplaint(page: number = 1, limit: number = this.itemsPerPage, status: string = this.selectStatus, emptype: string = this.selectEmployee, search: string = this.searchText) {
    this.isLoading = true;
    this.DistributionComplaintsSrv.dcmGetAllSentComplains(page, limit, status, emptype, search).subscribe(
      (res) => {
        this.complainArr = res.items
        console.log(this.complainArr);
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
    this.DistributionComplaintsSrv.dcmGetComplainById(id).subscribe(
      (res) => {
        this.replyObj = res.data;
        this.templateData = res.template
        this.isLoading = false;

      }
    )

  }

  filterStatus() {
    this.fetchAllDcmSentComplaint();
  }

  cancelStatus(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectStatus = '';
    this.isStatusDropdownOpen = false;
    this.fetchAllDcmSentComplaint();
  }

  filterEmployee() {
    this.fetchAllDcmSentComplaint();
  }

  cancelEmployee(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectEmployee = '';
    this.isEmployeeDropdownOpen = false;
    this.fetchAllDcmSentComplaint();
  }

  onSearch() {
    this.fetchAllDcmSentComplaint();

  }

  offSearch() {
    this.searchText = '';
    this.fetchAllDcmSentComplaint();

  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchAllDcmSentComplaint(this.page, this.itemsPerPage);
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
  language!: string
  firstNameEnglish:string = '';
  lastNameEnglish:string = '';
}

interface TemplateData {
  EngName: string
  SinName: string
  TamName: string
  companyNameEnglish: string
  companyNameSinhala: string
  companyNameTamil: string
  centerName: string
  regCode: string
}

import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DistributionComplaintsService } from '../../../services/distribution-complaints-service/distribution-complaints.service';


@Component({
  selector: 'app-dch-recieved-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './dch-recieved-complaints.component.html',
  styleUrl: './dch-recieved-complaints.component.css'
})
export class DchRecievedComplaintsComponent implements OnInit {

  complainArr!: RecivedComplaint[];
  replyObj: Reply = new Reply();
  templateData!: TemplateData;

  searchText: string = '';
  selectStatus: string = '';
  isReplyView: boolean = false;
  complainId!: number;
  selectLanguage: string = 'English';

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  isLoading:boolean = true;

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Assigned', 'Closed'];

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
    private DistributionComplainSrv: DistributionComplaintsService
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

  }

  fetchAllreciveComplaint(page: number = 1, limit: number = this.itemsPerPage, status: string = this.selectStatus, search: string = this.searchText) {
    this.isLoading = true;
    this.DistributionComplainSrv.getAllDCHReciveComplaints(page, limit, status, search).subscribe(
      (res) => {
        this.complainArr = res.items
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

  fetchGetReply(id: number) {
    this.isLoading = true;
    this.DistributionComplainSrv.dchGetComplainById(id).subscribe(
      (res) => {
        console.log('res', res)
        this.replyObj = res.data;
        this.templateData = res.template
        console.log('replyObj', this.replyObj)
        this.isLoading = false;
      }
    )
  }

  viewReply(id: number) {
    console.log('fetching')
    this.isReplyView = true;
    this.fetchGetReply(id);
  }

  cancelViewReply() {
    this.isReplyView = false;
  }

  onSearch() {
    this.fetchAllreciveComplaint();

  }

  offSearch() {
    this.searchText = '';
    this.fetchAllreciveComplaint();

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


  onPageChange(event: number) {
    this.page = event;
    this.fetchAllreciveComplaint(this.page, this.itemsPerPage);
  }

  navigateViewReply(id:number){
    this.router.navigate([`/dch-complaints/view-recieve-complaint/${id}`])
  }

}

class RecivedComplaint {
  id!: number
  refNo!: string
  complainCategory!: string
  complain!: string
  status!: string
  empId!: string
  reply: string | null = null
  createdAt!: Date
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

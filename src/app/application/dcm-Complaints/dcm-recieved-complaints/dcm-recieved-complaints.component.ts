import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DistributionComplaintsService } from '../../../services/distribution-complaints-service/distribution-complaints.service';

@Component({
  selector: 'app-dcm-recieved-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './dcm-recieved-complaints.component.html',
  styleUrl: './dcm-recieved-complaints.component.css'
})
export class DcmRecievedComplaintsComponent implements OnInit {

  complainArr!: RecivedComplaint[];
  replyObj: Reply = new Reply();
  managerDataObj: Manager = new Manager();
  replyDataObj: ReplyData = new ReplyData();

  searchText: string = '';
  selectStatus: string = '';
  isReplyView: boolean = false;
  complainId!: number;

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;
  isLoading: boolean = true;

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

  }

  fetchAllreciveComplaint(page: number = 1, limit: number = this.itemsPerPage, status: string = this.selectStatus, search: string = this.searchText) {
    this.isLoading = true;
    console.log('fetching')
    this.DistributionComplaintsSrv.dcmGetAllReciveComplaints(page, limit, status, search).subscribe(
      (res) => {
        this.complainArr = res.items
        this.totalItems = res.total;
        console.log(this.complainArr)

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
    this.DistributionComplaintsSrv.dcmGetReplyByComplaintId(id).subscribe(
      (res) => {
        console.log('replyres', res)
        this.replyDataObj = res.data;
        this.managerDataObj = res.dcmData;
        console.log('reply obj', this.replyDataObj)
        // this.replyObj.manageFirstNameEnglish = res.dcmData.manageFirstNameEnglish;
        // this.replyObj.manageFirstNameEnglish = res.dcmData.manageFirstNameSinhala;
        // this.replyObj.manageFirstNameEnglish = res.dcmData.manageFirstNameTamil;
        // this.replyObj.manageLastNameEnglish = res.dcmData.manageLastNameEnglish;
        // this.replyObj.manageLastNameEnglish = res.dcmData.manageLastNameSinhala;
        // this.replyObj.manageLastNameEnglish = res.dcmData.manageLastNameTamil;
        // this.replyObj.companyNameEnglish = res.dcmData.companyNameEnglish;
        // this.replyObj.companyNameSinhala = res.dcmData.companyNameSinhala;
        // this.replyObj.companyNameTamil = res.dcmData.companyNameTamil;
        // this.replyObj.centerName = res.dcmData.centerName;
        if (res.data.reply !== null) {
          this.replyObj.reply = this.createTemplate(this.replyDataObj, this.managerDataObj)
        }
        
        console.log('reply', this.replyObj.reply)
        this.isLoading = false;
      }
    )
  }

  viewReply(id: number) {
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
    this.isStatusDropdownOpen = false;
    this.fetchAllreciveComplaint();
  }


  onPageChange(event: number) {
    this.page = event;
    this.fetchAllreciveComplaint(this.page, this.itemsPerPage);
  }

  navigateViewComplaint(id: number) {
    this.router.navigate([`/dcm-complaints/view-dcm-recive-complaint/${id}`])
  }

  createTemplate(replyDataObj: ReplyData, managerDataObj: Manager): string {
    if (replyDataObj.language === 'Sinhala') {
      return `
  හිතවත් ${replyDataObj.firstNameSinhala} ${replyDataObj.lastNameSinhala},

  ${replyDataObj.reply}

  ඔබට තවත් ගැටළු හෝ ප්‍රශ්න තිබේ නම්, කරුණාකර අප හා සම්බන්ධ වන්න.
  ඔබේ ඉවසීම සහ අවබෝධය වෙනුවෙන් ස්තූතියි.
  
  මෙයට,
  ${managerDataObj.manageFirstNameSinhala} ${managerDataObj.manageLastNameSinhala},
  Collection Center Manager of ${managerDataObj.centerName},
  ${managerDataObj.companyNameSinhala}.
      `;
    } else if (replyDataObj.language === 'Tamil') {
      return `
  அன்புள்ள ${replyDataObj.firstNameTamil} ${replyDataObj.lastNameTamil},

  ${replyDataObj.reply}
  
  உங்களுக்கு மேலும் ஏதேனும் சிக்கல்கள் அல்லது கேள்விகள் இருந்தால், தயவுசெய்து எங்களைத் தொடர்பு கொள்ளவும். உங்கள் பொறுமைக்கும் புரிதலுக்கும் நன்றி.
  
  இதற்கு,
  ${managerDataObj.manageFirstNameTamil}  ${managerDataObj.manageLastNameTamil},
  Collection Center Manager of ${managerDataObj.centerName},
  ${managerDataObj.companyNameTamil}.
        `;
    } else {
      return `
  Dear ${replyDataObj.firstNameEnglish} ${replyDataObj.lastNameEnglish},

  ${replyDataObj.reply}
  
  If you have any further concerns or questions, feel free to reach out.
  Thank you for your patience and understanding.
  
  Sincerely, 
  ${managerDataObj.manageFirstNameEnglish} ${managerDataObj.manageLastNameEnglish},
  Collection Center Manager of ${managerDataObj.centerName},
  ${managerDataObj.companyNameEnglish}.
      `;
    }
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

class ReplyData {
  id!: number;
  refNo!: string;
  complain!: string;
  firstNameEnglish!: string;
  firstNameSinhala!: string;
  firstNameTamil!: string;
  lastNameEnglish!: string;
  lastNameSinhala!: string;
  lastNameTamil!: string;
  reply!: string;
  manageFirstNameEnglish!: string;
  manageFirstNameSinhala!: string;
  manageFirstNameTamil!: string;
  manageLastNameEnglish!: string;
  manageLastNameSinhala!: string;
  manageLastNameTamil!: string;
  companyNameEnglish!: string;
  companyNameSinhala!: string
  companyNameTamil!: string;
  centerName!: string;
  language!: string;

}

class Reply {
  id!: number;
  reply!: string;
} 
class Manager {
  companyNameEnglish!: string;
  companyNameSinhala!: string;
  companyNameTamil!: string;
  manageFirstNameEnglish!: string;
  manageFirstNameSinhala!: string;
  manageFirstNameTamil!: string;
  manageLastNameEnglish!: string;
  manageLastNameSinhala!: string;
  manageLastNameTamil!: string;
  centerName!: string;
}

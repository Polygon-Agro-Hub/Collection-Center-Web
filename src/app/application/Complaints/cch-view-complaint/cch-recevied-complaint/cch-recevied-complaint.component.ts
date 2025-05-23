import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-cch-recevied-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './cch-recevied-complaint.component.html',
  styleUrl: './cch-recevied-complaint.component.css',
    providers: [DatePipe]
  
})
export class CchReceviedComplaintComponent implements OnInit{
complainArr!: RecivedComplaint[];
  replyObj: Reply = new Reply();

  searchText: string = '';
  selectStatus: string = '';
  isReplyView: boolean = false;
  complainId!: number;

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  isLoading:boolean = true;

  constructor(
    private router: Router,
    private ComplainSrv: ComplaintsService,
  ) { }


  ngOnInit(): void {
    this.fetchAllreciveComplaint();
  }

  fetchAllreciveComplaint(page: number = 1, limit: number = this.itemsPerPage, status: string = this.selectStatus, search: string = this.searchText) {
    this.isLoading = true;
    this.ComplainSrv.getAllCCHReciveComplaints(page, limit, status, search).subscribe(
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
    this.ComplainSrv.getComplainById(id).subscribe(
      (res) => {
        this.replyObj = res.data;
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

  cancelStatus() {
    this.selectStatus = '';
    this.fetchAllreciveComplaint();
  }


  onPageChange(event: number) {
    this.page = event;
    this.fetchAllreciveComplaint(this.page, this.itemsPerPage);
  }

  navigateViewReply(id:number){
    this.router.navigate([`/cch-complaints/view-recive-reply/${id}`])
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
}

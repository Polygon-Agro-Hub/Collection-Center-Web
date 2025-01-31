import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';

@Component({
  selector: 'app-cch-send-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './cch-send-complaint.component.html',
  styleUrl: './cch-send-complaint.component.css',
  providers: [DatePipe]

})
export class CchSendComplaintComponent implements OnInit {
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


  constructor(
    private router: Router,
    private ComplainSrv: ComplaintsService,

  ) { }
  ngOnInit(): void {
    this.fetchAllreciveComplaint();
  }

  fetchAllreciveComplaint(page: number = 1, limit: number = this.itemsPerPage, status: string = this.selectStatus, emptype: string = this.selectEmployee, search: string = this.searchText) {
    this.ComplainSrv.getAllSentCCHComplains(page, limit, status, emptype, search).subscribe(
      (res) => {
        this.complainArr = res.items
        this.totalItems = res.total;
        this.officerId = res.userId
        if (res.items.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;

        }

      }
    )
  }

  fetchGetReply(id: number) {
    this.ComplainSrv.getComplainById(id).subscribe(
      (res) => {
        console.log(res);
        this.replyObj = res.data;
      }
    )
  }

  filterStatus() {
    this.fetchAllreciveComplaint();
  }

  cancelStatus() {
    this.selectStatus = '';
    this.fetchAllreciveComplaint();
  }

  filterEmployee() {
    this.fetchAllreciveComplaint();
  }

  cancelEmployee() {
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
}

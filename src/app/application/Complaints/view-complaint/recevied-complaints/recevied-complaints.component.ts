import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-recevied-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './recevied-complaints.component.html',
  styleUrl: './recevied-complaints.component.css',
  providers: [DatePipe]

})
export class ReceviedComplaintsComponent implements OnInit {
  complainArr!: RecivedComplaint[];

  searchText: string = '';
  selectStatus: string = '';

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

  fetchAllreciveComplaint(page: number = 1, limit: number = this.itemsPerPage, status: string = this.selectStatus, search: string = this.searchText) {
    this.ComplainSrv.getAllReciveComplaints(page, limit, status, search).subscribe(
      (res) => {
        this.complainArr = res.items
        this.totalItems = res.total;
        console.log(res.items.length);
        if (res.items.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;

        }

      }
    )
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
    // this.page = event;
    // this.fetchAllRequestPrice(this.page, this.itemsPerPage);
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

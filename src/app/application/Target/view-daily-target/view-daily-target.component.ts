import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { TargetService } from '../../../services/Target-service/target.service';

@Component({
  selector: 'app-view-daily-target',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './view-daily-target.component.html',
  styleUrls: ['./view-daily-target.component.css'],
  providers: [DatePipe]
})
export class ViewDailyTargetComponent implements OnInit {
  targetArr!: DailyTargets[];
  searchText: string = '';
  selectStatus: string = '';
  selectValidity: string = '';
  today!: string;
  hasData: boolean = true;
  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private TargetSrv: TargetService
  ) { }

  ngOnInit(): void {
    this.today = this.datePipe.transform(new Date(), 'yyyy/MM/dd') || '';
    this.fetchAllTarget();
  }

  fetchAllTarget(page: number = 1, limit: number = this.itemsPerPage, search: string = this.searchText) {
    this.TargetSrv.getAllDailyTarget(page, limit, search).subscribe(
      (res) => {
        this.targetArr = res.items;
        this.totalItems = res.totalPages
        if (res.length) {
          this.hasData = true;
        } else {
          this.hasData = false;
        }
      }
    );
  }

  checkValidity(toDate: string): string {
    const currentDate = new Date();
    const targetDate = new Date(toDate);

    if (targetDate >= currentDate) {
      return 'Active';
    } else {
      return 'Expired';
    }
  }

  onSearch() {
    this.fetchAllTarget();
   }
  offSearch() { 
    this.searchText = '';
    this.fetchAllTarget()
  }

  filterStatus() {
    if (!this.selectStatus) {
      this.fetchAllTarget();  // Reset and fetch all targets if no filter is selected
      return;
    }

    this.targetArr = this.targetArr.filter(item => item.status === this.selectStatus);
  }

  cancelStatus() {
    this.selectStatus = '';
    this.fetchAllTarget();
  }


  filterValidity() {
    if (!this.selectValidity) {
      this.fetchAllTarget();
      return;
    }

    this.targetArr = this.targetArr.filter(item => {
      if (this.selectValidity === 'Active') {
        return this.checkValidity(item.toDate) === 'Active';
      } else if (this.selectValidity === 'Expired') {
        return this.checkValidity(item.toDate) === 'Expired';
      }
      return true;
    });
  }

  cancelValidity() {
    this.selectValidity = '';
    this.fetchAllTarget();
  }


  onPageChange(event: number) {
    this.page = event;
    this.fetchAllTarget(this.page, this.itemsPerPage);

   }
  navigate(path: string) {
    this.router.navigate([path]);
  }
}

class DailyTargets {
  cropNameEnglish!: string;
  varietyNameEnglish!: string;
  toDate!: string;
  toTime!: string;
  grade!: string;
  TargetQty!: string;
  CompleteQty!: string;
  status!: string;
}

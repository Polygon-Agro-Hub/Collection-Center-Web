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
  assignTargetArr!: AssignDailyTarget[];
  searchText: string = '';
  selectStatus: string = '';
  selectValidity: string = '';
  today!: string;

  hasData: boolean = true;
  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 4;

  assignHasData: boolean = true;
  assignPage: number = 1;
  assignTotalItems: number = 0;
  assignItemsPerPage: number = 10;


  isSelectPrograss = true;
  isSelectAssign = false;

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private TargetSrv: TargetService
  ) { }

  ngOnInit(): void {
    this.today = this.datePipe.transform(new Date(), 'yyyy/MM/dd') || '';
    this.fetchAllTarget();
    this.AssignAllDailyTarget()
  }

  fetchAllTarget(page: number = 1, limit: number = this.itemsPerPage, search: string = this.searchText) {
    this.TargetSrv.getAllDailyTarget(page, limit, search).subscribe(
      (res) => {
        this.targetArr = res.items;
        this.totalItems = res.totalPages
        if (res.items.length > 0) {
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

  selectPrograss() {
    this.isSelectPrograss = true;
    this.isSelectAssign = false;
  }

  selectAssign() {
    this.isSelectPrograss = false;
    this.isSelectAssign = true;
  }

  AssignAllDailyTarget(page: number = 1, limit: number = this.itemsPerPage) {
    this.TargetSrv.AssignAllDailyTarget(page, limit).subscribe(
      (res) => {


        this.assignTargetArr = res.items;
        this.assignTotalItems = res.total;
        if (res.items.length > 0) {
          this.assignHasData = true;
        } else {
          this.assignHasData = false;
        }
      }
    );
  }

  navigateToAssignTarget(id: number) {
    this.router.navigate([`/target/assing-target/${id}`]);
  }
}

class AssignDailyTarget {
  id!: number;
  cropNameEnglish!: string;
  varietyNameEnglish!: string;
  qtyA!: string;
  qtyB!: string;
  qtyC!: string;
  toDate!: Date;
  toTime!: Date;
  fromTime!: Date;
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

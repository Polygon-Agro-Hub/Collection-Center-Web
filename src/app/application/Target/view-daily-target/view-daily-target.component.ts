import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { TargetService } from '../../../services/Target-service/target.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-view-daily-target',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './view-daily-target.component.html',
  styleUrls: ['./view-daily-target.component.css'],
  // providers: [DatePipe]
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

  isLoading: boolean = true;

  constructor(
    private router: Router,
    // private datePipe: DatePipe,
    private TargetSrv: TargetService
  ) { }

  ngOnInit(): void {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    this.today = `${year}/${month}/${day}`;

    this.fetchAllTarget();
    this.AssignAllDailyTarget()
  }

  fetchAllTarget(page: number = 1, limit: number = this.itemsPerPage, search: string = this.searchText) {
    this.isLoading = true;
    this.TargetSrv.getAllDailyTarget(page, limit, search).subscribe(
      (res) => {
        this.targetArr = res.items;
        this.totalItems = res.totalPages
        if (res.items.length > 0) {
          this.hasData = true;
        } else {
          this.hasData = false;
        }
        this.isLoading = false;

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
    this.isLoading = true;
    this.TargetSrv.AssignAllDailyTarget(page, limit).subscribe(
      (res) => {
        this.assignTargetArr = res.items;
        this.assignTotalItems = res.total;
        if (res.items.length > 0) {
          this.assignHasData = true;
        } else {
          this.assignHasData = false;
        }
        this.isLoading = false;

      }
    );
  }

  navigateToAssignTarget(id: number) {
    this.router.navigate([`/target/assing-target/${id}`]);
  }

  navigateToEditAssignTarget(id: number) {
    this.router.navigate([`/target/edit-assing-target/${id}`]);
  }

  formatTime(time: string): string {
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = minutesStr; // use as is, assuming it's already 2-digit
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // convert '0' to 12 for midnight and adjust hours >12
    return `${hours}:${minutes} ${period}`;
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
  toTime!: string;
  fromTime!: Date;
  isAssign!:number
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

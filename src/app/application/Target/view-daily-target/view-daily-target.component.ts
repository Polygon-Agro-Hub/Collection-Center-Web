import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  assignSearch: string = '';
  selectAssignStatus: string = ''


  isSelectPrograss = true;
  isSelectAssign = false;

  isLoading: boolean = false;

  constructor(
    private router: Router,

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

  AssignAllDailyTarget(page: number = 1, limit: number = this.itemsPerPage, search: string = this.assignSearch) {
    this.isLoading = true;
    this.TargetSrv.AssignAllDailyTarget(page, limit, search).subscribe(
      (res) => {
        this.assignTargetArr = res;
        if (res.length > 0) {
          this.assignHasData = true;
        } else {
          this.assignHasData = false;
        }
        this.isLoading = false;

      }
    );
  }

  navigateToAssignTarget(varietyId: number, companyCenterId: number) {
    this.router.navigate([`/target/assing-target/${varietyId}/${companyCenterId}`]);
  }

  navigateToEditAssignTarget(varietyId: number, companyCenterId: number) {
    this.router.navigate([`/target/edit-assing-target/${varietyId}/${companyCenterId}`]);
  }

  formatTime(time: string): string {
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = minutesStr; // use as is, assuming it's already 2-digit
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // convert '0' to 12 for midnight and adjust hours >12
    return `${hours}:${minutes} ${period}`;
  }

  formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0]
  }

  assignOnSearch() {
    this.AssignAllDailyTarget();
  }
  assignOffSearch() {
    this.assignSearch = '';
    this.AssignAllDailyTarget()
  }

  filterAssignStatus() {
    this.TargetSrv.AssignAllDailyTarget(1, 10, this.assignSearch).subscribe(
      (res) => {
        this.assignTargetArr = res;
        
        if (this.selectAssignStatus === 'Updated') {
          this.assignTargetArr = this.assignTargetArr.filter(item =>
            item.isAssign === 1 &&
            (item.assignStatusA === 0 || item.assignStatusB === 0 || item.assignStatusC === 0)
          );
        } else if (this.selectAssignStatus === 'Assigned') {
          this.assignTargetArr = this.assignTargetArr.filter(item =>
            item.isAssign === 1 && 
            item.assignStatusA === 1 && 
            item.assignStatusB === 1 && 
            item.assignStatusC === 1
          );
        } else if (this.selectAssignStatus === 'Not Assigned') {
          this.assignTargetArr = this.assignTargetArr.filter(item =>
            item.isAssign === 0 && 
            item.assignStatusA === 0 && 
            item.assignStatusB === 0 && 
            item.assignStatusC === 0
          );
        }
        
        // Update pagination variables
        this.assignTotalItems = this.assignTargetArr.length;
        this.assignPage = 1;
      }
    );
  }

  cancelAssignStatus(){
    this.selectAssignStatus = '';
    this.AssignAllDailyTarget();
  }


}

class AssignDailyTarget {
  cropNameEnglish!: string
  varietyNameEnglish!: string
  qtyA!: number
  qtyB!: number
  qtyC!: number
  assignStatusA!: number
  assignStatusB!: number
  assignStatusC!: number
  toDate!: string
  varietyId!: number;
  companyCenterId!: number;
  isAssign!: number;
}

class DailyTargets {
  id!: number;
  cropNameEnglish!: string;
  varietyNameEnglish!: string;
  grade!: string;
  target!: number;
  complete: number = 0;
  assignStatus: number = 0;
  status!: string;
  date: string = '';
}

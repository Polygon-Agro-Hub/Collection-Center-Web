import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { TargetService } from '../../../services/Target-service/target.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-view-center-target',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './view-center-target.component.html',
  styleUrl: './view-center-target.component.css'
})
export class ViewCenterTargetComponent implements OnInit {

  centerId!: number;

  targetArr!: DailyTargets[];

  searchText: string = '';
  selectStatus: string = '';
  selectValidity: string = '';
  today!: string;

  hasData: boolean = true;
  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;


  isLoading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    // private datePipe: DatePipe,
    private TargetSrv: TargetService
  ) { }

  ngOnInit(): void {
    this.centerId = this.route.snapshot.params['id'];
    console.log('got centerId', this.centerId);

    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    this.today = `${year}/${month}/${day}`;

    // this.fetchAllTarget();
    // this.AssignAllDailyTarget()
  }

  fetchAllTarget(centerId: number = this.centerId, page: number = 1, limit: number = this.itemsPerPage, search: string = this.searchText) {
    this.isLoading = true;
    this.TargetSrv.getAllCenterDailyTarget(centerId, page, limit, search).subscribe(
      (res) => {
        this.targetArr = res.items;
        console.log(this.targetArr);
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

  // checkValidity(toDate: string): string {
  //   const currentDate = new Date();
  //   const targetDate = new Date(toDate);

  //   if (targetDate >= currentDate) {
  //     return 'Active';
  //   } else {
  //     return 'Expired';
  //   }
  // }

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


  // filterValidity() {
  //   if (!this.selectValidity) {
  //     this.fetchAllTarget();
  //     return;
  //   }

  //   this.targetArr = this.targetArr.filter(item => {
  //     if (this.selectValidity === 'Active') {
  //       return this.checkValidity(item.toDate) === 'Active';
  //     } else if (this.selectValidity === 'Expired') {
  //       return this.checkValidity(item.toDate) === 'Expired';
  //     }
  //     return true;
  //   });
  // }

  getTimeRemaining(toDate: string, toTime: string): string {
    // Split date into parts and create a Date object in YYYY-MM-DD format (which is unambiguous)
    const [day, month, year] = toDate.split('/').map(Number);
    const targetDateTime = new Date(`${year}-${month}-${day} ${toTime}`);
  
    const currentDate = new Date();
  
    // If target date is invalid or in the past, return 'Expired'
    if (isNaN(targetDateTime.getTime()) || targetDateTime < currentDate) {
      return 'Expired';
    }
  
    // Calculate time difference in milliseconds
    const timeDiff = targetDateTime.getTime() - currentDate.getTime();
  
    // Convert to days, hours, and minutes
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursDiff = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
    // Only handle the first three conditions
    if (daysDiff > 0) {
      return `Expires in ${daysDiff} day${daysDiff > 1 ? 's' : ''}`;
    }
    if (hoursDiff > 0) {
      return `Expires in ${hoursDiff} hour${hoursDiff > 1 ? 's' : ''}`;
    }
    if (minutesDiff > 0) {
      return `Expires in ${minutesDiff} minute${minutesDiff > 1 ? 's' : ''}`;
    }
  
    // Default return 'Expired'
    return 'Expired';
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

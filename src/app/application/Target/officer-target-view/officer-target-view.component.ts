import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-officer-target-view',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, NgxPaginationModule],
  templateUrl: './officer-target-view.component.html',
  styleUrl: './officer-target-view.component.css'
})
export class OfficerTargetViewComponent {
  OfficerObj: Officer = new Officer();
  hasData: boolean = false;
  responseTitle: string = '--Fill input fields first--';
  targetArr: Target[] = [];

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  isLoading = false;

  selectStatus: string = '';
  searchText: string = '';
  selectValidity: string = '';

  isDownloading: boolean = false;
  hasData2: boolean = true;

  constructor(
    private router: Router,
    private TargetSrv: TargetService,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute
  ) { }

  onInit(): void {
    this.onSubmit()
  }

  fetchAllOfficers(page: number = this.page, limit: number = this.itemsPerPage, status: string = this.selectStatus, validity: string = this.selectValidity, searchText: string = this.searchText) {
    this.isLoading = true;
    if (this.OfficerObj.jobRole === 'Collection Centre Manager') {
      this.OfficerObj.empId = 'CCM' + this.OfficerObj.officerId;
    } else if (this.OfficerObj.jobRole === 'Collection Officer') {
      this.OfficerObj.empId = 'COO' + this.OfficerObj.officerId;
    } else if (this.OfficerObj.jobRole === 'Customer Officer') {
      this.OfficerObj.empId = 'CUO' + this.OfficerObj.officerId;
    }

    this.TargetSrv.getOfficerAvailabeTarget(this.OfficerObj, page, limit, status, validity, searchText).subscribe(
      // (res) => {
      //   console.log('fetching');
      //   console.log(this.hasData2);
      //   this.targetArr = res.result;
      //   this.totalItems = res.total;
      //   if (res.total === 0) {
      //     this.hasData2 = false;
      //   } else {
      //     this.hasData2 = true;
      //   }
      //   this.isLoading = false;

      //   console.log('fetched');
      //   console.log(this.hasData2);
      // }
      (res) => {
        if (res.status) {
          this.responseTitle = res.message;
          this.targetArr = res.result;
          this.totalItems = res.total;
          if (res.total === 0) {
            this.hasData = false;
          } else {
            this.hasData = true;
          }
          this.isLoading = false;
        } else {
          this.responseTitle = res.message;
          this.hasData = false;
          this.isLoading = false;

        }

        console.log(this.responseTitle, this.hasData);
        
      }
    )
  }

  onSubmit(page: number = this.page, limit: number = this.itemsPerPage, status: string = this.selectStatus, validity: string = this.selectValidity, searchText: string = this.searchText) {
    console.log('subbimiting');
    console.log(this.hasData);
    this.isLoading = true
    if (!this.OfficerObj.jobRole || !this.OfficerObj.officerId || !this.OfficerObj.fromDate || !this.OfficerObj.toDate) {
      this.toastSrv.warning('Fill All Input feilds')
      this.isLoading = false;
      return;
    }


    if (this.OfficerObj.jobRole === 'Collection Centre Manager') {
      this.OfficerObj.empId = 'CCM' + this.OfficerObj.officerId;
    } else if (this.OfficerObj.jobRole === 'Collection Officer') {
      this.OfficerObj.empId = 'COO' + this.OfficerObj.officerId;
    } else if (this.OfficerObj.jobRole === 'Customer Officer') {
      this.OfficerObj.empId = 'CUO' + this.OfficerObj.officerId;
    }

    this.TargetSrv.getOfficerAvailabeTarget(this.OfficerObj, page, limit, status, validity, searchText).subscribe(

      (res) => {
        // console.log('fetching');
        // console.log(this.hasData);
        // this.targetArr = res.result;
        // this.totalItems = res.total;
        // if (res.total === 0) {
        //   this.hasData = false;
        // } else {
        //   this.hasData = true;
        // }
        // this.isLoading = false;

        // console.log('fetched');
        // console.log(this.hasData);
        // console.log('fetching');
        // console.log(this.hasData);
        if (res.status) {
          this.responseTitle = res.message;
          this.hasData = true;
          this.targetArr = res.result;
          this.totalItems = res.total;
          this.isLoading = false;
        } else {
          this.responseTitle = res.message;
          this.hasData = false;
          this.isLoading = false;

        }
        console.log('fetched');
        console.log(this.hasData);
      }
    )
  }

  claculateTodo(num1: number, num2: number) {
    let todo;
    todo = num1 - num2;
    if (todo < 0) { todo = 0; }
    return todo;
  }

  onPageChange(event: number) {
    this.page = event;
    if (this.OfficerObj.fromDate && this.OfficerObj.fromDate) {
      this.fetchAllOfficers(this.page, this.itemsPerPage);
    } else {
      this.onSubmit();
    }

  }

  checkToDate() {
    if (!this.OfficerObj.fromDate) {
      this.toastSrv.warning('Please select the "From" date first.');
      this.OfficerObj.toDate = '';
      return;
    }

    const from = new Date(this.OfficerObj.fromDate);
    const to = new Date(this.OfficerObj.toDate);

    if (to < from) {
      this.toastSrv.warning('"To" date cannot be earlier than "From" date.');
      this.OfficerObj.toDate = '';
    }
  }

  editOfficerTarget(id: number, toDate: string, fromDate: string) {
    this.router.navigate(['/officer-target/edit-officer-target', id, toDate, fromDate]);
  }

  applyStatusFilters() {
    this.fetchAllOfficers();
  }

  clearStatusFilter() {
    this.selectStatus = ''
    this.fetchAllOfficers();
  }

  applyValidityFilters() {
    this.fetchAllOfficers();
  }

  clearValidityFilter() {
    this.selectValidity = ''
    this.fetchAllOfficers();
  }

  onSearch() {
    this.fetchAllOfficers();
  }

  offSearch() {
    this.searchText = ''
    this.fetchAllOfficers();
  }

  downloadTemplate1() {
    this.isDownloading = true;

    this.TargetSrv
      .downloadOfficerTarget(this.OfficerObj.fromDate, this.OfficerObj.toDate, this.OfficerObj.jobRole, this.OfficerObj.empId, this.selectStatus, this.selectValidity, this.searchText)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `Officer Target Report From ${this.OfficerObj.fromDate} To ${this.OfficerObj.toDate}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);

          this.toastSrv.success('Please check your downloads folder')
          this.isDownloading = false;
        },
        error: (error) => {
          this.toastSrv.error('Download Failed')
          this.isDownloading = false;
        }
      });
  }

  trimedSearchText() {
    this.searchText = this.searchText.trim()
  }


}

class Officer {
  jobRole: string = '';
  officerId: string = '';
  empId: string = '';
  toDate!: string;
  fromDate!: string;
}

class Target {
  id!: number;
  varietyNameEnglish!: string
  cropNameEnglish!: string
  grade!: string
  target!: number
  complete!: number
  date!: string
  validity!: string
}


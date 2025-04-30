import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportServiceService } from '../../../../services/Report-service/report-service.service';
import { TokenServiceService } from '../../../../services/Token/token-service.service';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-collection-report-component',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './collection-report-component.component.html',
  styleUrl: './collection-report-component.component.css'
})
export class CollectionReportComponentComponent implements OnInit {
  OfficerArr!: CollectionOfficers[];

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true

  searchText: string = '';

  logingRole: string | null = null;
  isLoading: boolean = true;


  constructor(
    private router: Router,
    private ReportSrv: ReportServiceService,
    private tokenSrv: TokenServiceService
  ) {
    this.logingRole = tokenSrv.getUserDetails().role
  }

  ngOnInit(): void {
    this.fetchAllOfficers();
  }

  fetchAllOfficers(page: number = 1, limit: number = this.itemsPerPage, searchText: string = '') {
    this.isLoading = true;
    let role: string;
    if (this.logingRole === 'Collection Center Head') {
      role = "CCH"
    } else {
      role = "CCM"
    }

    this.ReportSrv.getAllCollectionReport(role, page, limit, searchText).subscribe(
      (res) => {
        this.OfficerArr = res.items
        this.totalItems = res.total
        if (res.items.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;
        }
        this.isLoading = false;

      }
    )
  }

  onSearch() {
    this.fetchAllOfficers(this.page, this.itemsPerPage, this.searchText);
  }

  offSearch() {
    this.searchText = '';
    this.fetchAllOfficers(this.page, this.itemsPerPage, this.searchText);
  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchAllOfficers(this.page, this.itemsPerPage);
  }

  viewmonthlyReport(id: number) {
    this.router.navigate([`reports/collection-monthly-report/${id}`])
  }

  viewFarmerList(id: number, fname: string, lname: string) {
    const name = fname + ' ' + lname;
    this.router.navigate([`reports/farmer-list/${id}/${name}`])
  }

  viewDailyReport(id: number, fname: string, lname: string, empid: string) {
    let name = `${fname} ${lname}`
    this.router.navigate([`reports/daily-report/${id}/${name}/${empid}`])
  }

}

class CollectionOfficers {
  id!: number;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
  empId!: string;
  centerName!: string;
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReportServiceService } from '../../../../services/Report-service/report-service.service';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-sales-report-component',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './sales-report-component.component.html',
  styleUrl: './sales-report-component.component.css'
})
export class SalesReportComponentComponent {
  OfficerArr!: CollectionOfficers[];

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true

  searchText: string = '';
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private ReportSrv: ReportServiceService,

  ) { }

  ngOnInit(): void {
    this.fetchAllOfficers();
  }

  fetchAllOfficers(page: number = 1, limit: number = this.itemsPerPage, searchText: string = '') {
    this.isLoading = true;
    this.ReportSrv.getAllSalesReport(page, limit, searchText).subscribe(
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

}

class CollectionOfficers {
  id!: number;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
  empId!: string;
}

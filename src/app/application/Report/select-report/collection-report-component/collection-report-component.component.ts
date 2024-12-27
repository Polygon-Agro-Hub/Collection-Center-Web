import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportServiceService } from '../../../../services/Report-service/report-service.service';

@Component({
  selector: 'app-collection-report-component',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
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

  constructor(
    private router: Router,
    private ReportSrv: ReportServiceService,

  ) { }

  ngOnInit(): void {
    this.fetchAllOfficers();
  }

  fetchAllOfficers(page: number = 1, limit: number = this.itemsPerPage, searchText: string = '') {
    this.ReportSrv.getAllCollectionReport(page, limit, searchText).subscribe(
      (res) => {
        this.OfficerArr = res.items
        this.totalItems = res.total
        if (res.items.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;
        }

      }
    )
  }

  onSearch() {
    this.fetchAllOfficers(this.page, this.itemsPerPage,this.searchText);

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

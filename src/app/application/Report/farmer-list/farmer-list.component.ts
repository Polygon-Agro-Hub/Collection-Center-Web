import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReportServiceService } from '../../../services/Report-service/report-service.service';

@Component({
  selector: 'app-farmer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './farmer-list.component.html',
  styleUrl: './farmer-list.component.css'
})
export class FarmerListComponent implements OnInit {
  farmerListArr!: FarmerList[];
  officerId!: number;

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  searchText: string = '';
  selectDate: string = '';

  constructor(
    private router: Router,
    private ReportSrv: ReportServiceService,
    private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.officerId = this.route.snapshot.params['id']
    
    this.fetchFarmerList();

    
  }

  fetchFarmerList(page: number = 1, limit: number = this.itemsPerPage, searchText: string = '', date: string = this.selectDate) {
    this.ReportSrv.getCollectionFarmerList(this.officerId, page, limit, searchText,date).subscribe(
      (res) => {
        this.farmerListArr = res.items
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
    this.fetchFarmerList(this.page, this.itemsPerPage, this.searchText);
  }

  offSearch() { 
    this.searchText = '';
    this.fetchFarmerList(this.page, this.itemsPerPage, this.searchText);
  }

  filterDate(){
    this.fetchFarmerList(this.page, this.itemsPerPage, this.searchText, this.selectDate);
  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchFarmerList(this.page, this.itemsPerPage);
  }

  vieFarmerReport(id: number) {
    this.router.navigate([`reports/farmer-report/${id}`])
  }


}

class FarmerList {
  id!: number;
  firstName!: string
  lastName!: string
  NICnumber!: string
  totalAmount!: string
}

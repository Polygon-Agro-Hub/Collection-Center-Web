import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-view-daily-target',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './view-daily-target.component.html',
  styleUrl: './view-daily-target.component.css',
  providers: [DatePipe]

})
export class ViewDailyTargetComponent implements OnInit {

  searchText: string = '';
  selectStatus: string = '';
  selectValidity: string = '';
  today!: string;
  hasData:boolean = true;


  constructor(
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.today = this.datePipe.transform(new Date(), 'yyyy/MM/dd') || '';

  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSearch() {

  }

  offSearch() {

  }

  filterStatus() {

  }

  cancelStatus() {
    this.selectStatus = '';
  }

  filterValidity() {


  }

  cancelValidity() {
    this.selectValidity = '';
  }

  onPageChange(event: number) {
    // this.page = event;
    // this.fetchAllRequestPrice(this.page, this.itemsPerPage);
  }

  navigate(path:string){
    this.router.navigate([path])
  }
}

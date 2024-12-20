import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-view-price-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule],
  templateUrl: './view-price-list.component.html',
  styleUrl: './view-price-list.component.css'
})
export class ViewPriceListComponent implements OnInit {

  selectGrade: string = '';
  constructor(
    private router: Router
  ) {

  }

  ngOnInit(): void {
  }

  navigate(path: string) {
    this.router.navigate([`${path}`])
  }

  onPageChange(event: number) {
    // this.page = event;
    // this.fetchAllOfficers(this.page, this.itemsPerPage);
  }

  cancelGrade() {
    this.selectGrade = ''
  }

  onSearch() {

  }

  offSearch() {

  }

}

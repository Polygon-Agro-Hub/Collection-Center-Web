import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { DropdownModule } from 'primeng/dropdown';
import Swal from 'sweetalert2';
import { PriceListService } from '../../../services/Price-List-Service/price-list.service';

@Component({
  selector: 'app-view-price-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule],
  templateUrl: './view-price-list.component.html',
  styleUrl: './view-price-list.component.css',
  providers: [DatePipe]
})
export class ViewPriceListComponent implements OnInit {
  priceListArr!: PriceList[]

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true

  selectGrade: string = '';
  searchText:string = ''

  today!:string


  constructor(
    private router: Router,
    private PriceListSrv: PriceListService,
    private datePipe: DatePipe
  ) {

  }

  ngOnInit(): void {
    this.fetchAllPriceList()
    this.today = this.datePipe.transform(new Date(), 'yyyy/MM/dd') || '';
  }

  fetchAllPriceList(page: number = 1, limit: number = this.itemsPerPage, grade: string = this.selectGrade, search: string = this.searchText) {
    this.PriceListSrv.getAllPriceList(page, limit, grade, search).subscribe(
      (res) => {
        this.priceListArr = res.items
        this.totalItems = res.total
        if (res.item.lenght === 0) {
          this.hasData = false
        }
      }
    )
  }

  navigate(path: string) {
    this.router.navigate([`${path}`])
  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchAllPriceList(this.page, this.itemsPerPage);
  }

  filterGrade() {
    this.fetchAllPriceList(this.page, this.itemsPerPage, this.selectGrade, this.searchText)
  }

  cancelGrade() {
    this.selectGrade = '';
    this.fetchAllPriceList(this.page, this.itemsPerPage, this.selectGrade, this.searchText)

  }

  onSearch() {
    this.fetchAllPriceList(this.page, this.itemsPerPage, this.selectGrade, this.searchText)
    
  }

  offSearch() {
    this.searchText = ''
    this.fetchAllPriceList(this.page, this.itemsPerPage, this.selectGrade, this.searchText)

  }

  updateNavigation() {
    Swal.fire({
      title: 'Status Changed to Approved!',
      text: 'Your action has been successfully completed.',
      icon: 'success', // Type of alert ('success', 'error', 'warning', 'info')
      toast: true,
      position: 'bottom-right', // Alert position
      timer: 3000, // Auto-dismiss after 3 seconds
      timerProgressBar: true,
      showConfirmButton: false, // Hide the "OK" button
      didOpen: (toast) => {
        // Apply inline styles
        Object.assign(toast.style, {
          backgroundColor: '#2196f3', // Blue background
          color: 'white', // Text color
          fontSize: '16px', // Font size
          borderRadius: '25px', // Border radius
          padding: '15px', // Padding
        });
      },
    });
  }


}


class PriceList {
  id!: number
  cropNameEnglish!: string
  varietyNameEnglish!: string
  averagePrice!: string
  grade!: string
  updatedPrice!: string
  createdAt!:string
}

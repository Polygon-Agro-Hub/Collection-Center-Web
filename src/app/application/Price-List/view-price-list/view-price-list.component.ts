import { Router } from "@angular/router";
import { PriceListService } from "../../../services/Price-List-Service/price-list.service";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { NgxPaginationModule } from "ngx-pagination";
import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";

@Component({
  selector: 'app-view-price-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule],
  templateUrl: './view-price-list.component.html',
  styleUrl: './view-price-list.component.css',
  providers: [DatePipe]
})
export class ViewPriceListComponent implements OnInit {
  priceListArr!: PriceList[];

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  selectGrade: string = '';
  searchText: string = '';
  today!: string;
  editingIndex: number | null = null;
  editValue!: number

  constructor(
    private router: Router,
    private PriceListSrv: PriceListService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.fetchAllPriceList();
    this.today = this.datePipe.transform(new Date(), 'yyyy/MM/dd') || '';
  }

  fetchAllPriceList(page: number = 1, limit: number = this.itemsPerPage, grade: string = this.selectGrade, search: string = this.searchText) {
    this.PriceListSrv.getAllPriceList(page, limit, grade, search).subscribe((res) => {
      this.priceListArr = res.items;
      this.totalItems = res.total;
      if (res.item.length === 0) {
        this.hasData = false;
      }
    });
  }

  navigate(path: string) {
    this.router.navigate([`${path}`]);
  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchAllPriceList(this.page, this.itemsPerPage);
  }

  filterGrade() {
    this.fetchAllPriceList(this.page, this.itemsPerPage, this.selectGrade, this.searchText);
  }

  cancelGrade() {
    this.selectGrade = '';
    this.fetchAllPriceList(this.page, this.itemsPerPage, this.selectGrade, this.searchText);
  }

  onSearch() {
    this.fetchAllPriceList(this.page, this.itemsPerPage, this.selectGrade, this.searchText);
  }

  offSearch() {
    this.searchText = '';
    this.fetchAllPriceList(this.page, this.itemsPerPage, this.selectGrade, this.searchText);
  }

  editRow(index: number, currentValue: number) {
    this.editingIndex = index; // Set the row index being edited
    this.editValue = currentValue; // Initialize editValue with the current price
  }
  
  saveRow(id: number) {
    if (this.editValue != null) {
      this.PriceListSrv.updatePrice(id, this.editValue).subscribe(
        (res) => {
          if(res.status){
            Swal.fire('success',"Price Updated success", 'success')
          }else{
            Swal.fire('success',"Price Updated success", 'success')
          }
          this.fetchAllPriceList(this.page, this.itemsPerPage);
        },
        (error) => {
          console.error("Error updating price:", error);
        }
      );
    }
    this.editingIndex = null; // Reset the editing index
  }
}  

class PriceList {
  id!: number;
  cropNameEnglish!: string;
  varietyNameEnglish!: string;
  averagePrice!: string;
  grade!: string;
  updatedPrice!: number;
  createdAt!: string;
}

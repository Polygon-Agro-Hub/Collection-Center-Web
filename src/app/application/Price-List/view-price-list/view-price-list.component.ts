import { Router } from "@angular/router";
import { PriceListService } from "../../../services/Price-List-Service/price-list.service";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { NgxPaginationModule } from "ngx-pagination";
import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { LoadingSpinnerComponent } from "../../../components/loading-spinner/loading-spinner.component";
import { TargetService } from '../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-view-price-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule, LoadingSpinnerComponent],
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
  editValue!: number;

  originalValue!: number;

  isLoading: boolean = true;


  constructor(
    private router: Router,
    private PriceListSrv: PriceListService,
    private datePipe: DatePipe,
    private toastSrv: ToastAlertService,
  ) { }

  ngOnInit(): void {
    this.fetchAllPriceList();
    this.today = this.datePipe.transform(new Date(), 'yyyy/MM/dd') || '';
  }

  fetchAllPriceList(page: number = 1, limit: number = this.itemsPerPage, grade: string = this.selectGrade, search: string = this.searchText) {
    this.PriceListSrv.getAllPriceList(page, limit, grade, search).subscribe((res) => {
      this.priceListArr = res.items;
      this.totalItems = res.total;
      if (res.items.length === 0) {
        this.hasData = false;
      } else {
        this.hasData = true;
      }
      this.isLoading = false;
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

  isInvalidInput(): boolean {
    // Return true if input is invalid (to disable the button)
    return this.editValue === null ||
      this.editValue === undefined ||
      isNaN(this.editValue) ||
      this.editValue <= 0;
  }

  validateInput() {
    // Optional: Additional validation logic if needed
    // For example, formatting or additional checks
    if (this.editValue < 0) {
      this.editValue = 0;
    }
  }

  editRow(index: number, currentValue: number) {
    this.editingIndex = index; // Set the row index being edited
    this.editValue = currentValue;
 // Initialize editValue with the current price
    this.originalValue = currentValue; // Store the original value for comparison
  }

  saveRow(id: number, crop: string, variety: string, grade: string) {

    console.log(this.originalValue);


    if (this.editValue != null) {
      console.log('edit', this.editValue);
      this.PriceListSrv.updatePrice(id, this.editValue).subscribe(
        (res) => {
          if (res.status) {
            this.isLoading = false;
            this.toastSrv.success(
              `Successfully changed price of <b style="color:black;">${crop}-${variety}-${grade}</b><br>
               from <b style="color:black;">Rs.${this.originalValue}</b> to 
               <b style="color:black;">Rs.${this.editValue.toFixed(2)}</b>`, 
              { enableHtml: true }
            );
          } else {
            this.isLoading = false;
            this.toastSrv.error('Failed to assign the target!');
          }
          this.fetchAllPriceList(this.page, this.itemsPerPage);
        },
        (error) => {
          console.error('Error updating price:', error);
          Swal.fire('Error', 'Failed to update price', 'error');
        }
      );
      this.editingIndex = null;
    } else {
      this.editingIndex = null;
    }
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

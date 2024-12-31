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
    // if (this.editValue != null) {
    //   Swal.fire({
    //     html: `
    //       <div style="text-align: center; font-family: Arial, sans-serif;">
    //         <div style="
    //           margin-bottom: 16px;
    //           display: flex;
    //           justify-content: center;
    //           align-items: center;
    //           width: 48px;
    //           height: 48px;
    //           border-radius: 50%;
    //           background-color: #F4F4F4;
    //           margin: 0 auto;
    //         ">
    //           <i class="fa-solid fa-exclamation" style="color: #415CFF; font-size: 24px;"></i>
    //         </div>
    //         <h3 style="font-size: 18px; color: #333; margin-bottom: 8px;">You have unsaved changes.</h3>
    //         <p style="font-size: 14px; color: #666; margin: 0;">
    //           If you leave this page now, your changes will be lost.<br>
    //           Do you want to continue without saving?
    //         </p>
    //       </div>
    //     `,
    //     showCancelButton: true,
    //     confirmButtonColor: '#415CFF',
    //     cancelButtonColor: '#F4F4F4',
    //     confirmButtonText: `
    //       <span style="
    //         display: inline-block;
    //         background-color: #415CFF;
    //         color: white;
    //         border: none;
    //         padding: 8px 16px;
    //         border-radius: 8px;
    //         font-size: 14px;">
    //         Stay on page
    //       </span>
    //     `,
    //     cancelButtonText: `
    //       <span style="
    //         display: inline-block;
    //         background-color: #F4F4F4;
    //         color: #333;
    //         border: 1px solid #E5E5E5;
    //         padding: 8px 16px;
    //         border-radius: 8px;
    //         font-size: 14px;">
    //         Leave without saving
    //       </span>
    //     `,
    //     reverseButtons: true,
    //   }).then((result) => {
    //     if (result.dismiss === Swal.DismissReason.cancel) {
    //       this.PriceListSrv.updatePrice(id, this.editValue).subscribe(
    //         (res) => {
    //           if (res.status) {
    //             Swal.fire('Success', 'Price updated successfully', 'success');
    //           } else {
    //             Swal.fire('Error', 'Price update failed', 'error');
    //           }
    //           this.fetchAllPriceList(this.page, this.itemsPerPage);
    //         },
    //         (error) => {
    //           console.error('Error updating price:', error);
    //           Swal.fire('Error', 'Failed to update price', 'error');
    //         }
    //       );
    //       this.editingIndex = null;
    //     }
    //   });
    // } else {
    //   this.editingIndex = null;
    // }

    if (this.editValue != null) {
      Swal.fire({
        title: 'Are you sure?',
        showCancelButton: true,
        confirmButtonColor: '#415CFF',
        reverseButtons: true,
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('warning', 'Price updated cancel', 'warning');
          
        }else{
          this.PriceListSrv.updatePrice(id, this.editValue).subscribe(
            (res) => {
              if (res.status) {
                Swal.fire('Success', 'Price updated successfully', 'success');
              } else {
                Swal.fire('Error', 'Price update failed', 'error');
              }
              this.fetchAllPriceList(this.page, this.itemsPerPage);
            },
            (error) => {
              console.error('Error updating price:', error);
              Swal.fire('Error', 'Failed to update price', 'error');
            }
          );
          this.editingIndex = null;
        }
      });
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

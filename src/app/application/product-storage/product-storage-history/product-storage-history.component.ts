import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DistributionServiceService } from '../../../services/Distribution-Service/distribution-service.service';
import { CustomDatepickerComponent } from '../../../components/custom-datepicker/custom-datepicker.component';



@Component({
  selector: 'app-product-storage-history',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, CustomDatepickerComponent, LoadingSpinnerComponent],
  templateUrl: './product-storage-history.component.html',
  styleUrl: './product-storage-history.component.css'
})
export class ProductStorageHistoryComponent implements OnInit {

  itemsArr!: ShortageProducts[];
  selectedDate: string | Date | null = null;

  searchText: string = '';

  hasData: boolean = true;
  isLoading: boolean = true;

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Assigned', 'Not Assigned'];

  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  constructor(
    private router: Router,
    private ComplainSrv: ComplaintsService,
    private DistributionSrv: DistributionServiceService,
    private location: Location,
  ) { }


   ngOnInit(): void {
    this.selectedDate = this.getYesterdayDateString();
    this.getAllShortageHistory();
  }

  private getYesterdayDateString(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getAllShortageHistory(date: string | Date | null = this.selectedDate, search: string = this.searchText) {
    console.log('searchText', this.searchText)
    this.isLoading = true;
    this.DistributionSrv.fetchAllShortageHistory(date, search).subscribe(
      (res) => {
        this.itemsArr = res.data
        console.log('itemsArr', this.itemsArr)
        if (res.data.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;

        }
        this.isLoading = false;

      }
    )
  }

  onSearch() {
    this.searchText = this.searchText.trimStart();
    this.getAllShortageHistory();

  }

  offSearch() {
    this.searchText = '';
    this.getAllShortageHistory();

  }

  goBack() {
    this.location.back();
  }

onDateChange(newDate: string | Date | null) {
    let dateString: string;
  
    if (!newDate) {

      dateString = this.getYesterdayDateString();
    }
    else if (newDate instanceof Date) {
      
      dateString = newDate.toISOString().split('T')[0];
    } 
    else {
      
      dateString = newDate;
    }
  
    this.selectedDate = dateString;
    this.getAllShortageHistory();
  }

}


class ShortageProducts {
  id!: number;
  mpItemId!: number;
  qty!: number;
  displayName!: string;
  image!: string;
  assignOfficerId!: number | null;
  empId!: string;
  price!: number;
  prchQty!: number;
  prchPrice!: number;
  createdAt!: Date;
}

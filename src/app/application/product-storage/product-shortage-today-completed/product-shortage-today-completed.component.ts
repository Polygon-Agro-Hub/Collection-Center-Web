import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DistributionServiceService } from '../../../services/Distribution-Service/distribution-service.service';


@Component({
  selector: 'app-product-shortage-today-completed',
  standalone: true,
    imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './product-shortage-today-completed.component.html',
  styleUrl: './product-shortage-today-completed.component.css'
})
export class ProductShortageTodayCompletedComponent implements OnInit {

  itemsArr!: ShortageProducts[];

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
        private location: Location
  ) { }


   ngOnInit(): void {
    this.getAllShortageTodayCompleted();
  }

  getAllShortageTodayCompleted(search: string = this.searchText) {
    console.log('searchText', this.searchText)
    this.isLoading = true;
    this.DistributionSrv.fetchAllShortageTodayCompleted(search).subscribe(
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
    this.getAllShortageTodayCompleted();

  }

  offSearch() {
    this.searchText = '';
    this.getAllShortageTodayCompleted();

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

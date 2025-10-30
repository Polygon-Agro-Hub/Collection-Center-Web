import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { DropdownModule } from 'primeng/dropdown';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';
import { ProcurementsService } from '../../../services/Procurement-service/procurements.service';
import { CustomDatepickerComponent } from '../../../components/custom-datepicker/custom-datepicker.component';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { Observable, tap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-requested-items',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule, LoadingSpinnerComponent, SerchableDropdownComponent, CustomDatepickerComponent],
  templateUrl: './requested-items.component.html',
  styleUrl: './requested-items.component.css'
})
export class RequestedItemsComponent implements OnInit {
  itemsArr!: RequestedItems[];
  centerArr: Center[] = [];
  selectCenters: string = '';
  searchText: string = '';
  selectProvince: string = '';
  selectDistrict: string = '';
  totalItems: number = 0;
  countOfOfficers: number = 0;

  logingRole: string | null = null;

  selectedDate: string = '';

  isLoading: boolean = true;
  hasData: boolean = true;

  centerId!: string;
  isDownloading: boolean = false;

  constructor(
    private router: Router,
    private ProcurementsService: ProcurementsService,
    private tokenSrv: TokenServiceService
  ) {
    this.logingRole = tokenSrv.getUserDetails().role
    
  }

  ngOnInit(): void {
    this.selectedDate = new Date().toISOString().split('T')[0];

    console.log('loging role', this.logingRole)
  
    if (this.logingRole === 'Distribution Centre Manager') {
      console.log('manager')
      this.fetchDistributionCentre().subscribe({
        next: () => {
          this.callMethodByRole();
        },
        error: (err) => {
          console.error('Error fetching distribution centre:', err);
          this.callMethodByRole(); // still continue even if it fails
        }
      });
    } else if (this.logingRole === 'Distribution Centre Head') {
      console.log('head')
      this.callMethodByRole();
    }
  
    this.getAllCenters();
  }
  

  callMethodByRole() {
    if (this.logingRole === 'Distribution Centre Manager') {
      this.fetchAllRequestedItemsForDCM();
    } else if (this.logingRole === 'Distribution Centre Head') {
      this.fetchAllRequestedItemsForDCH();

    }
  }

  fetchDistributionCentre(): Observable<any> {
    console.log('fetching dcm');
    return this.ProcurementsService.getDistributionCenter().pipe(
      tap((res) => {
        this.centerId = String(res);
        console.log('centerId', this.centerId);
      })
    );
  }
  

  getAllCenters() {
    this.ProcurementsService.getDCHOwnCenters().subscribe(
      (res) => {
        this.centerArr = res

      }
    )
  }

  onDateChange(newDate: string | Date | null) {
    let dateString: string;
  
    if (!newDate) {
      
      dateString = new Date().toISOString().split('T')[0];
    } 
    else if (newDate instanceof Date) {
      
      dateString = newDate.toISOString().split('T')[0];
    } 
    else {
      
      dateString = newDate;
    }
  
    this.selectedDate = dateString;
    this.callMethodByRole();
  }
  

  get centerDropdownItems() {
    return this.centerArr.map(center => ({
      value: center.id.toString(),
      label: `${center.regCode} - ${center.centerName}`,
      disabled: false
    }));
  }

  // 5. Update your methods
  onCenterSelectionChange(selectedValue: string) {
    this.selectCenters = selectedValue || '';
    this.applyCompanyFilters();
  }

  applyCompanyFilters() {
    this.callMethodByRole();
  }

  fetchAllRequestedItemsForDCH(center: string = this.selectCenters, date: string = this.selectedDate, search: string = this.searchText) {
    console.log('calling dch')  
    this.isLoading = true;
      this.ProcurementsService.getAllRequestedItemsForDCH(center, date, search).subscribe(
          (res) => {
              this.itemsArr = res.groupedProducts;
              this.totalItems = res.totalItems;
              this.isLoading = false;

              if (this.itemsArr.length > 0) {
                this.hasData = true;
              } else {
                this.hasData = false;
              }

              console.log('itemsArr', this.itemsArr)
          }
      );
  }

  fetchAllRequestedItemsForDCM(center: string = this.centerId, date: string = this.selectedDate, search: string = this.searchText) {
    this.isLoading = true;
    console.log('calling dcm')
    this.ProcurementsService.getAllRequestedItemsForDCH(center, date, search).subscribe(
        (res) => {
            this.itemsArr = res.groupedProducts;
            this.totalItems = res.totalItems;
            this.isLoading = false;

            if (this.itemsArr.length > 0) {
              this.hasData = true;
            } else {
              this.hasData = false;
            }

            console.log('itemsArr', this.itemsArr)
        }
    );
}

  onSearch() {
      this.searchText = this.searchText?.trim() || '';
      this.callMethodByRole();
  }

  offSearch() {
      this.searchText='';
      this.callMethodByRole();
  }


  downloadTemplate1() {
    this.isDownloading = true;

    if (this.logingRole === 'Distribution Centre Manager') {
      this.ProcurementsService
      .downloadRequestedItemsReportFile(this.centerId, this.selectedDate, this.searchText)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `Centre Requirement on ${this.selectedDate}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);

          Swal.fire({
            icon: "success",
            title: "Downloaded",
            text: "Please check your downloads folder",
            customClass: {
              popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
              title: 'dark:text-white',
            }
          });
          this.isDownloading = false;
        },
        error: (error) => {
          Swal.fire({
            icon: "error",
            title: "Download Failed",
            text: error.message,
            customClass: {
              popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
              title: 'dark:text-white',
            }
          });
          this.isDownloading = false;
        }
      });
    } else if (this.logingRole === 'Distribution Centre Head') {
      this.ProcurementsService
      .downloadRequestedItemsReportFile(this.selectCenters, this.selectedDate, this.searchText)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          if (!this.selectCenters) {
            a.download = `All Required Items on ${this.selectedDate}.xlsx`;
          } else {
            a.download = `Required Items of [${this.itemsArr[0].regCode}-${this.itemsArr[0].centerName} on ${this.selectedDate}].xlsx`;
          }
          
          a.click();
          window.URL.revokeObjectURL(url);

          Swal.fire({
            icon: "success",
            title: "Downloaded",
            text: "Please check your downloads folder",
            customClass: {
              popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
              title: 'dark:text-white',
            }
          });
          this.isDownloading = false;
        },
        error: (error) => {
          Swal.fire({
            icon: "error",
            title: "Download Failed",
            text: error.message,
            customClass: {
              popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
              title: 'dark:text-white',
            }
          });
          this.isDownloading = false;
        }
      });
    }

    
  }


}

class RequestedItems {
  centerId!: number
  centerName!: string
  regCode!: string
  qty!: number
  productName!: string
  productId!: number
  sheduleDate!: Date
}

class Center {
    id!: number
    centerName!: string;
    regCode!: string;
  }
  
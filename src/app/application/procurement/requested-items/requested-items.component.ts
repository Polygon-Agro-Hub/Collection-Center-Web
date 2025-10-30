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

  // Define all Sri Lanka provinces
  isProvinceDropdownOpen = false;
  isDistrictDropdownOpen = false;

  provinces: string[] = [
      'Western',
      'Central',
      'Southern',
      'Northern',
      'Eastern',
      'North Western',
      'North Central',
      'Uva',
      'Sabaragamuwa'
  ];

  // Define all districts with their provinces
  allDistricts = [
      { name: 'Ampara', province: 'Eastern' },
      { name: 'Anuradhapura', province: 'North Central' },
      { name: 'Badulla', province: 'Uva' },
      { name: 'Batticaloa', province: 'Eastern' },
      { name: 'Colombo', province: 'Western' },
      { name: 'Galle', province: 'Southern' },
      { name: 'Gampaha', province: 'Western' },
      { name: 'Hambantota', province: 'Southern' },
      { name: 'Jaffna', province: 'Northern' },
      { name: 'Kalutara', province: 'Western' },
      { name: 'Kandy', province: 'Central' },
      { name: 'Kegalle', province: 'Sabaragamuwa' },
      { name: 'Kilinochchi', province: 'Northern' },
      { name: 'Kurunegala', province: 'North Western' },
      { name: 'Mannar', province: 'Northern' },
      { name: 'Matale', province: 'Central' },
      { name: 'Matara', province: 'Southern' },
      { name: 'Monaragala', province: 'Uva' },
      { name: 'Mullaitivu', province: 'Northern' },
      { name: 'Nuwara Eliya', province: 'Central' },
      { name: 'Polonnaruwa', province: 'North Central' },
      { name: 'Puttalam', province: 'North Western' },
      { name: 'Rathnapura', province: 'Sabaragamuwa' },
      { name: 'Trincomalee', province: 'Eastern' },
      { name: 'Vavuniya', province: 'Northern' },
  ];

  // Districts filtered by selected province
  // filteredDistricts: { name: string, province: string }[] = [];

  constructor(
    private router: Router,
    private ProcurementsService: ProcurementsService,
    private tokenSrv: TokenServiceService
  ) {
    this.logingRole = tokenSrv.getUserDetails().role
    if (this.logingRole === 'Distribution Centre Manager') {
      this.fetchDistributionCentre();
    }
  }

  ngOnInit(): void {
      // this.updateFilteredDistricts();
      this.selectedDate = new Date().toISOString().split('T')[0];
      this.callMethodByRole();
      this.getAllCenters();
  }

  callMethodByRole() {
    if (this.logingRole === 'Distribtuion Centre Head') {
      this.fetchAllRequestedItemsForDCH();
    } else {
      this.fetchAllRequestedItemsForDCM();

    }
  }

  fetchDistributionCentre() {
    this.ProcurementsService.getDistributionCenter().subscribe(
      (res) => {
        this.centerId = String(res)
        

      }
    )
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


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
      const provinceDropdownElement = document.querySelector('.custom-province-dropdown-container');
      const proinceDropdownClickedInside = provinceDropdownElement?.contains(event.target as Node);

      if (!proinceDropdownClickedInside && this.isProvinceDropdownOpen) {
          this.isProvinceDropdownOpen = false;
      }

      const districtDropdownElement = document.querySelector('.custom-district-dropdown-container');
      const districtDropdownClickedInside = districtDropdownElement?.contains(event.target as Node);

      if (!districtDropdownClickedInside && this.isDistrictDropdownOpen) {
          this.isDistrictDropdownOpen = false;
      }

  }

  fetchAllRequestedItemsForDCH(center: string = this.selectCenters, date: string = this.selectedDate, search: string = this.searchText) {
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

  
  navigateToDashboard(id: number) {
      this.router.navigate([`/centers/center-shashbord/${id}`]);
  }


  addCenter() {
      this.router.navigate([`/centers/add-a-center`]);
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
  
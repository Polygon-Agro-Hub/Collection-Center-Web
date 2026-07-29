import { CommonModule, Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { DropdownModule } from 'primeng/dropdown';
import { PriceListService } from '../../../services/Price-List-Service/price-list.service';
import Swal from 'sweetalert2';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DistributionServiceService } from '../../../services/Distribution-Service/distribution-service.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { producerIncrementEpoch } from '@angular/core/primitives/signals';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';
import { CustomDatepickerComponent } from '../../../components/custom-datepicker/custom-datepicker.component';


@Component({
  selector: 'app-product-storage-history',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule, CustomDatepickerComponent, LoadingSpinnerComponent, SerchableDropdownComponent],
  templateUrl: './product-storage-history.component.html',
  styleUrl: './product-storage-history.component.css'
})
export class ProductStorageHistoryComponent implements OnInit {

  totalItems: number = 0;
  hasData: boolean = true;

  searchText: string = '';

  productId: string = '';

  selectStatus: string = '';
  today!: string;
  isPopupVisible: boolean = false
  isLoading: boolean = false;

  date: string = '';

  isReplacePopUpOpen: boolean = false;

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Not Approved', 'Approved', 'Rejected'];

    dummyData = [
  {
    id: 1,
    image: 'assets/images/product1.jpg',
    name: 'Chicken Curry',
    shortage: 20,
    price: 1200,
    assignee: '',
    Assign: 1,
    purchased: 100,
    perchasedPerKg: 23
  },
  {
    id: 2,
    image: 'assets/images/product2.jpg',
    name: 'Fish Curry',
    shortage: 20,
    price: 950,
    assignee: 'CCM0001',
    Assign: 1,
    purchased: 100,
    perchasedPerKg: 23
  },
  {
    id: 3,
    image: 'assets/images/product3.jpg',
    name: 'Dhal Curry',
    shortage: 20,
    price: 450,
    assignee: 'CCM0001',
    Assign: 0,
    purchased: 100,
    perchasedPerKg: 23
  },
  {
    id: 4,
    image: 'assets/images/product4.jpg',
    name: 'Vegetable Stir Fry',
    shortage: 20,
    price: 700,
    assignee: 'CCM0001',
    Assign: 0,
    purchased: 100,
    perchasedPerKg: 23
  }
];

  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  selectStatusOption(option: string) {
    this.selectStatus = option;
    this.isStatusDropdownOpen = false;
    this.filterStatus();
  }

  constructor(
    private router: Router,
    private PriceListSrv: PriceListService,
    private distributionSrv: DistributionServiceService,
    private toastSrv: ToastAlertService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.date = new Date().toISOString().split('T')[0];
    console.log('date', this.date)
    // this.today = new Date().toISOString().split('T')[0];
    // this.fetchAllRequests();

  }


  fetchAllRequests(date: string = this.date, status: string = this.selectStatus, search: string = this.searchText) {
    this.isLoading = true;
    // this.distributionSrv.getAllRequests(date, status, search).subscribe(
    //   (res) => {
    //     console.log('res', res)
    //     this.requestArr = res.items;
    //     console.log('requestArr', this.requestArr)
    //     this.totalItems = res.total;
    //     console.log(res)
    //     console.log(res.items)

    //     if (res.items.length === 0) {
    //       this.hasData = false;
    //     } else {
    //       this.hasData = true;

    //     }
    //     this.isLoading = false;
    //   }
    // )
  }


  closePopup() {
    this.isReplacePopUpOpen = false;
    this.fetchAllRequests();
  }

  onDateChange(newDate: string | Date | null) {
    let formattedDate: string = '';

    if (newDate instanceof Date) {
      // Convert Date object to string (YYYY-MM-DD)
      formattedDate = newDate.toISOString().split('T')[0];
    } else if (typeof newDate === 'string') {
      formattedDate = newDate;
    }

    this.date = formattedDate;
    this.fetchAllRequests(this.date, this.selectStatus, this.searchText);
  }

  onSearch() {
    this.searchText = this.searchText?.trim() || '';
    this.fetchAllRequests(this.date, this.selectStatus, this.searchText);
  }

  offSearch() {
    this.searchText = '';
    this.fetchAllRequests(this.date, this.selectStatus, this.searchText);
  }

  cancelStatus(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectStatus = '';
    this.isStatusDropdownOpen = false;
    this.fetchAllRequests(this.date, this.selectStatus, this.searchText);
  }

  filterStatus() {
    this.fetchAllRequests(this.date, this.selectStatus, this.searchText);
  }

  navigate(path: string) {
    this.router.navigate([`${path}`]);
  }

  goBack() {
    this.location.back();
  }

}


class Request {
  rrId!: number;
  officerId!: number
  replceId!: number
  orderPackageId!: number
  currentProductTypeId!: number
  currentProductQty!: number
  currentProductPrice!: number
  currentprodcutType!: string
  currentProductTypeName!: string
  currentProductShortCode!: string
  currentProductUnitTypeId!: string
  currentProductUnitPrice!: number
  isPacked!: boolean
  status!: string
  empId!: string
  isLock!: boolean
  currentProduct!: string
  replaceProductId!: number
  replaceQty!: number
  reqreplaceQty!: number
  replaceProduct!: string
  replacePrice!: number
  replaceProductType!: string;
  replaceUnitPrice!: number;
  replaceUnitType!: string;

  prevDefineProductId!: number
  prevDefineProduct!: string
  prevDefineProductUnitPrice!: number
  prevDefineProductUnitTypeId!: number
  prevDefineProductShortCode!: string
  prevDefineProductTypeName!: string
  prevDefineProductTypeId!: number
  prevDefineProductQty!: number
  prevDefineProductPrice!: number

  createdAt!: Date;
}

class Products {
  id!: number;
  displayName!: string;
  discountedPrice!: number;
  unitType!: string;
}

class ProductReplacement {
  replacedProductId!: number;
  replacedProduct!: string;
  replacedProductQty!: number;
  replacedUnitPrice!: number;
  replacedProductPrice!: number;
  requestedProductId!: number;
  requestedProduct!: string;
  requestedProductQty!: number;
  requestedUnitPrice!: number;
  requestedProductPrice!: number;
  definedProductId!: number;
  definedProduct!: string;
  definedProductQty!: number;
  definedUnitPrice!: number;
  definedProductPrice!: number;

}

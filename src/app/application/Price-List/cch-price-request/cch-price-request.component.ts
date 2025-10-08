import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { DropdownModule } from 'primeng/dropdown';
import { PriceListService } from '../../../services/Price-List-Service/price-list.service';
import Swal from 'sweetalert2';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';


@Component({
  selector: 'app-cch-price-request',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule, LoadingSpinnerComponent, SerchableDropdownComponent],
  templateUrl: './cch-price-request.component.html',
  styleUrl: './cch-price-request.component.css',
  providers: [DatePipe]
})
export class CchPriceRequestComponent implements OnInit {
  reqPriceArr!: RequestPrice[];

  priceRequestObject: Request = new Request();

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  searchText: string = '';
  selectGrade: string = '';
  selectStatus: string = '';
  today!: string;
  isPopupVisible: boolean = false
  isLoading: boolean = false;
  requestId!: number;

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Pending', 'Approved', 'Rejected'];

  logingRole: string | null = null;

  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  selectStatusOption(option: string) {
    this.selectStatus = option;
    this.isStatusDropdownOpen = false;
    this.filterStatus();
  }


  isGradeDropdownOpen = false;
  gradeDropdownOptions = ['A', 'B', 'C'];

  toggleGradeDropdown() {
    this.isGradeDropdownOpen = !this.isGradeDropdownOpen;
  }

  selectGradeOption(option: string) {
    this.selectGrade = option;
    this.isGradeDropdownOpen = false;
    this.filterGrade();
  }

  constructor(
    private router: Router,
    private PriceListSrv: PriceListService,
    private datePipe: DatePipe,
    private tokenSrv: TokenServiceService,
  ) {this.logingRole = tokenSrv.getUserDetails().role}

  ngOnInit(): void {
    this.today = this.datePipe.transform(new Date(), 'yyyy/MM/dd') || '';
    this.fetchAllRequestPriceCCH()
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const statusDropdownElement = document.querySelector('.custom-status-dropdown-container');
    const statusDropdownClickedInside = statusDropdownElement?.contains(event.target as Node);

    const gradeDropdownElement = document.querySelector('.custom-grade-dropdown-container');
    const roleDropdownClickedInside = gradeDropdownElement?.contains(event.target as Node);

    if (!statusDropdownClickedInside && this.isStatusDropdownOpen) {
      this.isStatusDropdownOpen = false;
    }

    if (!roleDropdownClickedInside && this.isGradeDropdownOpen) {
      this.isGradeDropdownOpen = false;
    }

  }

  fetchAllRequestPriceCCH(page: number = 1, limit: number = this.itemsPerPage, grade: string = this.selectGrade, status: string = '', search: string = this.searchText) {
    this.isLoading = true;
    this.PriceListSrv.getAllRequestPriceCCH(page, limit, grade, status, search).subscribe(
      (res) => {
        this.reqPriceArr = res.items;
        this.totalItems = res.total;
        console.log(res)
        console.log(res.items)

        if (res.items.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;

        }
        this.isLoading = false;
      }
    )
  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchAllRequestPriceCCH(this.page, this.itemsPerPage);
  }

  onSearch() {
    this.fetchAllRequestPriceCCH(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus, this.searchText);
  }

  offSearch() {
    this.searchText = '';
    this.fetchAllRequestPriceCCH(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus, this.searchText);
  }

  // cancelGrade() {
  //   this.selectGrade = '';
  //   this.fetchAllRequestPrice(this.page, this.itemsPerPage, this.selectGrade);
  // }

  filterGrade() {
    this.fetchAllRequestPriceCCH(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus, this.searchText);
  }

  cancelGrade(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectGrade = '';
    this.isGradeDropdownOpen = false;
    this.fetchAllRequestPriceCCH(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus, this.searchText);
  }


  cancelStatus(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectStatus = '';
    this.isStatusDropdownOpen = false;
    this.fetchAllRequestPriceCCH(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus, this.searchText);
  }

  filterStatus() {
    this.fetchAllRequestPriceCCH(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus, this.searchText);
  }

  navigate(path: string) {
    this.router.navigate([`${path}`]);
  }

  trimmedSearchText() {
    if (this.searchText && this.searchText.startsWith(' ')) {
      this.searchText = this.searchText.trim();
    }
  }

  openPopUp(requestId: number, officerId: number) {
    this.requestId = requestId;
    console.log('requestId', requestId);
  
    // Navigate with route parameter
    this.router.navigate([`cch-price-request/cch-center-price-list/${requestId}/${officerId}`]);
  }

}


class RequestPrice {
  id!: number
  requestPrice!: string
  status!: string
  empId!: string
  grade!: string
  varietyNameEnglish!: string
  cropNameEnglish!: string
  createdAt!: string
  assignRole!: string
  centerName!: string
  regCode!: string;
  officerId!: number;
}

class Request {
  id!: number;
  cropGroupId: number | null = null;
  cropVarietyId: number | null = null;
  grade: string = ''
  currentPrice: number | null = null;
  requstPrice: number | null = null;
}
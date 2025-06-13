import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportServiceService } from '../../../services/Report-service/report-service.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { TokenServiceService } from '../../../services/Token/token-service.service';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent
  ],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.css',
  providers: [DatePipe]
})
export class CollectionComponent implements OnInit {

  farmerPaymentsArr!: FarmerPayments[];
  centerArr: Center[] = [];
  totalPaymentsAmount: number = 0; // New variable to store the sum of all payments

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  // Filter variables
  searchText: string = '';
  selectCenters: string = '';

  isCenterManager: boolean = false;

  fromDate: Date | string = '';
  toDate: Date | string = '';

  isPopupVisible: boolean = false;
  logingRole: string | null = null;
  isLoading: boolean = false;
  isDateFilterSet: boolean = false;


  isDownloading = false;

  isCenterDropdownOpen = false;
  centerDropdownOptions = [];

  toggleCenterDropdown() {
    this.isCenterDropdownOpen = !this.isCenterDropdownOpen;
  }

  selectCenterOption(center: Center) {
    this.selectCenters = center.id.toString(); // convert id to string
    this.isCenterDropdownOpen = false;
    this.applyCompanyFilters();
  }


  constructor(
    private router: Router,
    private ReportSrv: ReportServiceService,
    private datePipe: DatePipe,
    private ManageOficerSrv: ManageOfficersService,
    private toastSrv: ToastAlertService,
    private tokenSrv: TokenServiceService
  ) {
    this.logingRole = tokenSrv.getUserDetails().role
  }

  ngOnInit(): void {
    this.getAllCenters();
    if (this.logingRole === "Collection Center Manager") {
      this.isCenterManager = true;
    } else {
      this.isCenterManager = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const centerDropdownElement = document.querySelector('.custom-center-dropdown-container');
    const centerDropdownClickedInside = centerDropdownElement?.contains(event.target as Node);

    if (!centerDropdownClickedInside && this.isCenterDropdownOpen) {
      this.isCenterDropdownOpen = false;
    }
  }

  navigate(path: string) {
    this.router.navigate([`${path}`]);
  }

  fetchFilteredPayments(page: number = 1, limit: number = this.itemsPerPage) {
    this.isLoading = true;

    this.ReportSrv.getAllCollections(
      page,
      limit,
      this.fromDate,
      this.toDate,
      this.selectCenters,
      this.searchText
    ).subscribe(
      (res) => {
        this.farmerPaymentsArr = res.items.map((item: FarmerPayments) => {
          return {
            ...item,
            totalQuantity: (
              Number(item.totalGradeAQuantity || 0) +
              Number(item.totalGradeBQuantity || 0) +
              Number(item.totalGradeCQuantity || 0)
            ).toFixed(2)
          };
        });
        this.totalItems = res.total;
        this.hasData = res.items.length > 0;
        this.isLoading = false;

        // Calculate the total amount whenever new data is fetched
        this.calculateTotalPayments();
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }


  private formatNumberToTwoDecimals(value: any): number {
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    return parseFloat(num.toFixed(2));
  }

  calculateTotalPayments(): void {
    this.totalPaymentsAmount = this.farmerPaymentsArr.reduce((sum, payment) => {
      const amount = this.formatNumberToTwoDecimals(payment.totalAmount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    // Ensure the final total is also formatted to 2 decimal places
    this.totalPaymentsAmount = this.formatNumberToTwoDecimals(this.totalPaymentsAmount);
  }

  onSearch() {
    this.fetchFilteredPayments();
  }

  offSearch() {
    this.searchText = '';
    this.fetchFilteredPayments();
  }

  onPageChange(event: number) {
    this.page = event;

    if (this.selectCenters || this.searchText) {
      this.fetchFilteredPayments(this.page, this.itemsPerPage);
    } else {
      this.fetchFilteredPayments(this.page, this.itemsPerPage);
    }
  }

  applyCompanyFilters() {
    this.fetchFilteredPayments();
  }

  clearCompanyFilter(event: MouseEvent) {
    event.stopPropagation();
    this.selectCenters = '';
    this.fetchFilteredPayments();
  }

  get selectedCenterDisplay(): string {
    if (!this.selectCenters) return 'Centers';
    
    const selectedCenter = this.centerArr.find(center => center.id.toString() === this.selectCenters);
    return selectedCenter ? `${selectedCenter.regCode} - ${selectedCenter.centerName}` : 'Centers';
  }

  validateToDate(toDateInput: HTMLInputElement) {
    // Case 1: User hasn't selected fromDate yet
    if (!this.fromDate) {
        this.toDate = '';            // Clear model
        toDateInput.value = '';      // Clear input field
        this.toastSrv.warning("Please select the 'From' date first.");
        return;
    }

    // Case 2: toDate is earlier than fromDate
    if (this.toDate) {
        const from = new Date(this.fromDate);
        const to = new Date(this.toDate);

        if (to <= from) {
            this.toDate = '';        // Clear model
            toDateInput.value = '';  // Clear input field
            this.toastSrv.warning("The 'To' date cannot be earlier than or same to the 'From' date.");
        }
    }
}


  validateFromDate() {
    // Case 1: User hasn't selected fromDate yet
    if (!this.toDate) {
      return;
    }

    // Case 2: toDate is earlier than fromDate
    if (this.toDate) {
      const from = new Date(this.fromDate);
      const to = new Date(this.toDate);

      if (to <= from) {
        this.fromDate = ''; // Reset toDate
        this.toastSrv.warning("The 'From' date cannot be Later than or same to the 'From' date.");
      }
    }
  }


  goBtn() {
    if (!this.fromDate || !this.toDate) {
      this.toastSrv.warning("Please fill in all fields");
      return;
    }

    this.isDateFilterSet = true;

    this.fetchFilteredPayments();
  }

  getAllCenters() {
    this.ManageOficerSrv.getCCHOwnCenters().subscribe(
      (res) => {
        this.centerArr = res;
      }
    );
  }

  downloadTemplate1() {
    this.isDownloading = true;

    this.ReportSrv
      .downloadCollectionReportFile(this.fromDate, this.toDate, this.selectCenters, this.searchText)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `Collection Report From ${this.fromDate} To ${this.toDate}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);

          Swal.fire({
            icon: "success",
            title: "Downloaded",
            text: "Please check your downloads folder",
          });
          this.isDownloading = false;
        },
        error: (error) => {
          Swal.fire({
            icon: "error",
            title: "Download Failed",
            text: error.message,
          });
          this.isDownloading = false;
        }
      });
  }




}

class FarmerPayments {
  invNo!: string;
  totalAmount!: number;
  centerCode!: string;
  centerName!: string;
  cropNameEnglish!: string;
  varietyNameEnglish!: string;
  nic!: string;
  firstNameEnglish!: string;
  totalGradeAQuantity!: number;
  totalGradeBQuantity!: number;
  totalGradeCQuantity!: number;
  status!: string;
  createdAt!: string | Date;
  companyId!: number;
  totalQuantity!: number;
}

class Center {
  id!: number;
  centerName!: string;
  regCode!: string;
}


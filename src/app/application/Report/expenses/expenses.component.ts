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
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css',
  providers: [DatePipe]
})
export class ExpensesComponent implements OnInit {

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

  logingRole: string | null = null;

  fromDate: string = '';
  toDate:  string = '';
  maxDate: string = new Date().toISOString().split('T')[0];

  isPopupVisible: boolean = false;
  isLoading: boolean = false;
  isDateFilterSet: boolean = false;

  isCenterManager: boolean = false;

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


  isDownloading = false;

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

    this.ReportSrv.getAllPayments(
      page,
      limit,
      this.fromDate,
      this.toDate,
      this.selectCenters,
      this.searchText
    ).subscribe(
      (res) => {
        this.farmerPaymentsArr = res.items;
        this.totalItems = res.total;
        this.hasData = res.items.length > 0;
        this.isLoading = false;
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
    const from = this.fromDate ? new Date(this.fromDate) : null;
    const to = this.toDate ? new Date(this.toDate) : null;

    // Always clear toDate if fromDate is not properly set
    if (!from || isNaN(from.getTime())) {
        if (this.toDate) {
            this.toDate = '';           // Clear model
            toDateInput.value = '';     // Clear input field directly
            console.log(this.toDate);
        }
        this.toastSrv.warning("Please select the 'From' date first.");
        return;
    }

    // If toDate is set, check if it's valid against fromDate
    if (to && !isNaN(to.getTime())) {
        if (to <= from) {
            this.toDate = '';           // Clear model
            toDateInput.value = '';     // Clear input field directly
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
      this.toastSrv.warning("Please select a date range to view the data");
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
      .downloadPaymentReportFile(this.fromDate, this.toDate, this.selectCenters, this.searchText)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `Expenses Report From ${this.fromDate} To ${this.toDate}.xlsx`;
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

  navigateToFarmerReport(invNo: string) {
    this.router.navigate([`reports/farmer-report-invoice/${invNo}`]);
  }


}

class FarmerPayments {
  invNo!: string;
  totalAmount!: number;
  centerCode!: string;
  centerName!: string;
  id!: number;
  nic!: string;
  firstNameEnglish!: string;
  gradeAprice!: number;
  gradeBprice!: number;
  gradeCprice!: number;
  gradeAquan!: number;
  gradeBquan!: number;
  gradeCquan!: number;
  status!: string;
  createdAt!: string | Date;
  companyId!: number;
}

class Center {
  id!: number;
  centerName!: string;
  regCode!: string;
}
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
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';
import { CustomDatepickerComponent } from '../../../components/custom-datepicker/custom-datepicker.component';
@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent, SerchableDropdownComponent, CustomDatepickerComponent ],
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
  toDate: string = '';
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
    this.fetchFilteredPayments();
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
    this.searchText = this.searchText.trimStart();
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


  get selectedCenterDisplay(): string {
    if (!this.selectCenters) return 'Centres';

    const selectedCenter = this.centerArr.find(center => center.id.toString() === this.selectCenters);
    return selectedCenter ? `${selectedCenter.regCode} - ${selectedCenter.centerName}` : 'Centres';
  }

  onFromDateChange(date: string | Date | null) {
    const selectedDate = date as string || '';
    
    // Validate against max date (today)
    if (selectedDate && selectedDate > this.maxDate) {
      this.toastSrv.warning("From date cannot be in the future.");
      return;
    }
    
    this.fromDate = selectedDate;
    this.validateFromDate();
  }
  
  onToDateChange(date: string | Date | null) {
    const selectedDate = date as string || '';
    
    // Validate against max date (today)
    if (selectedDate && selectedDate > this.maxDate) {
      this.toastSrv.warning("To date cannot be in the future.");
      return;
    }
    
    this.toDate = selectedDate;
    this.validateToDate();
  }
  
  validateToDate() {
    const from = this.fromDate ? new Date(this.fromDate) : null;
    const to = this.toDate ? new Date(this.toDate) : null;
  
    // Always clear toDate if fromDate is not properly set
    if (!from || isNaN(from.getTime())) {
      if (this.toDate) {
        this.toDate = '';
        console.log(this.toDate);
      }
      this.toastSrv.warning("Please select the 'From' date first.");
      return;
    }
  
    // If toDate is set, check if it's valid against fromDate
    if (to && !isNaN(to.getTime())) {
      if (to <= from) {
        this.toDate = '';
        this.toastSrv.warning("The 'To' date cannot be earlier than or same as the 'From' date.");
      }
    }
  }
  
  validateFromDate() {
    // Case 1: User hasn't selected toDate yet
    if (!this.toDate) {
      return;
    }
  
    // Case 2: Check if current toDate is still valid with new fromDate
    if (this.toDate) {
      const from = new Date(this.fromDate);
      const to = new Date(this.toDate);
  
      if (to <= from) {
        this.toDate = ''; // Reset toDate
        this.toastSrv.warning("The 'To' date has been cleared because it was earlier than or same as the new 'From' date.");
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

  checkLeadingSpace() {
    if (this.searchText && this.searchText.startsWith(' ')) {
      this.searchText = this.searchText.trim();
    }
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
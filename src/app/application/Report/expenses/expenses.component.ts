import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportServiceService } from '../../../services/Report-service/report-service.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
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

  

  fromDate: Date | string = '';
  toDate: Date | string = '';

  isPopupVisible: boolean = false;
  logingRole: string | null = null;
  isLoading: boolean = false;
  isDateFilterSet: boolean = false;


  isDownloading = false;

  constructor(
    private router: Router,
    private ReportSrv: ReportServiceService,
    private datePipe: DatePipe,
    private ManageOficerSrv: ManageOfficersService,
    private toastSrv: ToastAlertService
  ) { }

  ngOnInit(): void {
    this.getAllCenters();
  }

  navigate(path: string) {
    this.router.navigate([`${path}`]);
  }

  // fetchAllPayments(
  //   page: number = 1,
  //   limit: number = this.itemsPerPage
  // ) {
  //   this.isLoading = true;
  
  //   console.log('Sending fromDate:', this.fromDate);
  //   console.log('Sending toDate:', this.toDate);
  
  //   this.ReportSrv.getAllPayments(page, limit, this.fromDate, this.toDate).subscribe(
  //     (res) => {
  //       this.farmerPaymentsArr = res.items;
  //       this.totalItems = res.total;
  //       this.hasData = res.items.length > 0;
  //       this.isLoading = false;
  //       this.calculateTotalPayments();
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //     }
  //   );
  // }

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
        console.log(res);
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
  

  // New method to calculate the total payments amount
  private formatNumberToTwoDecimals(value: any): number {
    // Convert to number if it's a string
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    // Round to 2 decimal places
    return parseFloat(num.toFixed(2));
  }

  // Update the calculateTotalPayments method
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
      // User has applied center/search filter
      console.log('filtered payments')
      this.fetchFilteredPayments(this.page, this.itemsPerPage);
    } else {
      // Default data fetch using only date range
      console.log('normal payments')
      this.fetchFilteredPayments(this.page, this.itemsPerPage);
    }
  }

  applyCompanyFilters() {
    console.log(this.selectCenters);
    this.fetchFilteredPayments();
  }

  clearCompanyFilter() {
    this.selectCenters = '';
    this.fetchFilteredPayments();
  }

  validateToDate() {
    // Case 1: User hasn't selected fromDate yet
    if (!this.fromDate) {
      this.toDate = ''; // Reset toDate
      this.toastSrv.warning("Please select the 'From' date first.");
      return;
    }
  
    // Case 2: toDate is earlier than fromDate
    if (this.toDate) {
      const from = new Date(this.fromDate);
      const to = new Date(this.toDate);
  
      if (to <= from) {
        this.toDate = ''; // Reset toDate
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

    this.isDateFilterSet  = true;

    this.fetchFilteredPayments();
  }

  getAllCenters() {
    this.ManageOficerSrv.getCCHOwnCenters().subscribe(
      (res) => {
        console.log(res);
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

  navigateToFarmerReport(invNo: string) {
    console.log(invNo);
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
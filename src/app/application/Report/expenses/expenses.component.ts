import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportServiceService } from '../../../services/Report-service/report-service.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
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
  selectMonth: string = '';
  selectStatus: string = '';
  selectRole: string = '';
  searchText: string = '';
  selectCenters: string = '';
  selectedDate: string = '';
  customDateSelected: boolean = false;  // Track if user selected a custom date

  isPopupVisible: boolean = false;
  logingRole: string | null = null;
  isLoading: boolean = true;

  months = [
    { value: '01', name: 'January' },
    { value: '02', name: 'February' },
    { value: '03', name: 'March' },
    { value: '04', name: 'April' },
    { value: '05', name: 'May' },
    { value: '06', name: 'June' },
    { value: '07', name: 'July' },
    { value: '08', name: 'August' },
    { value: '09', name: 'September' },
    { value: '10', name: 'October' },
    { value: '11', name: 'November' },
    { value: '12', name: 'December' }
  ];

  constructor(
    private router: Router,
    private ReportSrv: ReportServiceService,
    private datePipe: DatePipe,
    private ManageOficerSrv: ManageOfficersService,
    private toastSrv: ToastAlertService
  ) { }

  ngOnInit(): void {
    // Set default date to current date
    this.setCurrentDate();
    this.fetchAllPayments();
    this.getAllCenters();
  }

  setCurrentDate(): void {
    const today = new Date();
    this.selectedDate = this.formatDateForInput(today);
    this.customDateSelected = false;
  }

  formatDateForInput(date: Date): string {
    // Format date as YYYY-MM-DD for input element
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  navigate(path: string) {
    this.router.navigate([`${path}`]);
  }

  fetchAllPayments(
    page: number = 1,
    limit: number = this.itemsPerPage,
    searchText: string = this.searchText,
    selectCompany: string = this.selectCenters
  ) {
    this.isLoading = true;

    // Determine which filter to use
    let dateToUse = '';
    if (this.selectMonth) {
      const currentYear = new Date().getFullYear();
      dateToUse = `${currentYear}-${this.selectMonth}`; // Format: YYYY-MM
    } else {
      dateToUse = this.customDateSelected ? this.selectedDate : this.formatDateForInput(new Date());
    }

    this.ReportSrv.getAllPayments(page, limit, searchText, selectCompany, dateToUse).subscribe(
      (res) => {
        this.farmerPaymentsArr = res.items;
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
      return sum + (isNaN(amount) ? 0 : amount); }, 0);
    
    // Ensure the final total is also formatted to 2 decimal places
    this.totalPaymentsAmount = this.formatNumberToTwoDecimals(this.totalPaymentsAmount);
  }

  onSearch() {
    this.fetchAllPayments();
  }

  offSearch() {
    this.searchText = '';
    this.fetchAllPayments();
  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchAllPayments(this.page);
  }

  applyCompanyFilters() {
    this.fetchAllPayments();
  }

  clearCompanyFilter() {
    this.selectCenters = '';
    this.fetchAllPayments();
  }

  applyMonthFilters() {
    if (this.customDateSelected) {
      this.selectMonth = '';
      this.toastSrv.error('Please clear date filter before selecting month');
      // Reset month selection
      return;
    }
    this.selectedDate = '';
    this.fetchAllPayments();
  }

  applyDateFilter() {
    if (this.selectMonth) {
      this.toastSrv.error('Please clear month filter before selecting date');
      // this.showToast('Please clear month filter before selecting date');
      this.selectedDate = ''; // Reset date selection
      return;
    }
    this.selectMonth = '';
    this.customDateSelected = true;
    this.fetchAllPayments();
  }

  clearMonthFilters() {
    this.selectMonth = '';
    // Reset to current date when month is cleared
    this.selectedDate = this.formatDateForInput(new Date());
    this.customDateSelected = false;
    this.fetchAllPayments();
  }
  
  clearDateFilter() {
    this.customDateSelected = false;
    this.selectedDate = this.formatDateForInput(new Date());
    this.fetchAllPayments();
  }

  getAllCenters() {
    this.ManageOficerSrv.getCCHOwnCenters().subscribe(
      (res) => {
        console.log(res);
        this.centerArr = res;
      }
    );
  }

  onDateChange(newDate: string) {
    if (this.selectMonth) {
      this.toastSrv.error('Please clear month filter before selecting date');
      return;
    }
    this.selectedDate = newDate;
    this.customDateSelected = true;
    this.fetchAllPayments();
  }
}

class FarmerPayments {
  invNo!: string;
  totalAmount!: number;
  centerCode!: string;
  centerName!: string;
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
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { CustomDatepickerComponent } from '../../../components/custom-datepicker/custom-datepicker.component';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { TargetService } from '../../../services/Target-service/target.service';

@Component({
  selector: 'app-quantity-based-collection-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, CustomDatepickerComponent, SerchableDropdownComponent],
  templateUrl: './quantity-based-collection-reports.component.html',
  styleUrl: './quantity-based-collection-reports.component.css'
})
export class QuantityBasedCollectionReportsComponent implements OnInit {

  @ViewChild('fromDatePicker') fromDatePicker!: CustomDatepickerComponent;
  @ViewChild('toDatePicker') toDatePicker!: CustomDatepickerComponent;

  isLoading = false;
  isDownloading = false;

  logingRole = '';
  centerArr: Center[] = [];
  selectCenter = '';

  maxDate: string = new Date().toISOString().split('T')[0];
  fromDate: Date | string = '';   // yyyy-MM-dd
  toDate: Date | string = '';     // yyyy-MM-dd

  /** true once "Go" has been pressed with valid filters (same flag name as the Collection report) */
  isDateFilterSet = false;
  reportArr: QuantityCollectionRow[] = [];

  constructor(
    private router: Router,
    private manageOfficerSrv: ManageOfficersService,
    private tokenSrv: TokenServiceService,
    private toastSrv: ToastAlertService,
    private targetSrv: TargetService
  ) {
    this.logingRole = this.tokenSrv.getUserDetails().role;
  }

  ngOnInit(): void {
    if (this.isCentreHead) {
      this.getAllCenters();
    }
  }

  get isCentreHead(): boolean {
    return this.logingRole === 'Collection Centre Head';
  }

  get hasData(): boolean {
    return this.reportArr.length > 0;
  }

  // ---------- Centre dropdown ----------

  getAllCenters() {
    this.manageOfficerSrv.getCCHOwnCenters().subscribe({
      next: (res) => {
        this.centerArr = res || [];
        // Default to Colombo; fall back to the first centre if Colombo isn't in this user's list.
        // Set after the list loads so the dropdown can find and display the item.
        const hasDefault = this.centerArr.some(c => Number(c.id) === DEFAULT_CENTER_ID);
        const fallback = this.centerArr[0]?.id;
        this.selectCenter = hasDefault ? DEFAULT_CENTER_ID.toString() : (fallback ? fallback.toString() : '');
      },
      error: (err) => console.error('Failed to load centres', err),
    });
  }

  get centerDropdownItems() {
    return this.centerArr.map(center => ({
      value: center.id.toString(),
      label: `${center.regCode} - ${center.centerName}`,
      disabled: false,
    }));
  }

  onCenterSelectionChange(selectedValue: string) {
    // Clearing is disabled, so ignore empty values and keep the current centre
    if (selectedValue) {
      this.selectCenter = selectedValue;
    }
  }

  // ---------- Dates (same behaviour as Reports > Collection) ----------

  onFromDateChange(date: string | Date | null) {
    const selectedDate = (date as string) || '';

    if (selectedDate && selectedDate > this.maxDate) {
      this.fromDate = '';
      if (this.fromDatePicker) {
        this.fromDatePicker.selectedDate = null;
      }
      this.toastSrv.warning('From date cannot be in the future.');
      return;
    }

    this.fromDate = selectedDate;
    this.validateFromDate();
  }

  onToDateChange(date: string | Date | null) {
    const selectedDate = (date as string) || '';

    if (selectedDate && selectedDate > this.maxDate) {
      this.toDate = '';
      if (this.toDatePicker) {
        this.toDatePicker.selectedDate = null;
      }
      this.toastSrv.warning('To date cannot be in the future.');
      return;
    }

    this.toDate = selectedDate;
    this.validateToDate();
  }

  validateToDate() {
    if (!this.fromDate) {
      this.clearToDate();
      this.toastSrv.warning("Please select the 'From' date first.");
      return;
    }

    // Same day is allowed (single-day report); only an earlier To date is rejected
    if (this.toDate && new Date(this.toDate) < new Date(this.fromDate)) {
      this.clearToDate();
      this.toastSrv.warning("The 'To' date cannot be earlier than the 'From' date.");
    }
  }

  validateFromDate() {
    if (this.toDate && this.fromDate && new Date(this.toDate) < new Date(this.fromDate)) {
      this.clearToDate();
      this.toastSrv.warning("The 'To' date has been cleared because it was earlier than the new 'From' date.");
    }
  }

  private clearToDate() {
    this.toDate = '';
    if (this.toDatePicker) {
      this.toDatePicker.selectedDate = null;
    }
  }

  // ---------- Go ----------

  goBtn() {
    if (this.isCentreHead && !this.selectCenter) {
      this.toastSrv.warning('Please select a Centre');
      return;
    }
    if (!this.fromDate && !this.toDate) {
      this.toastSrv.warning('Please select a date range to view the data');
      this.isDateFilterSet = false;
      return;
    }
    if (!this.fromDate) {
      this.toastSrv.warning('Please select a From Date');
      this.isDateFilterSet = false;
      return;
    }
    if (!this.toDate) {
      this.toastSrv.warning('Please select a To Date');
      this.isDateFilterSet = false;
      return;
    }

    this.isDateFilterSet = true;
    this.fetchReport();
  }

  fetchReport() {
    this.isLoading = true;

    // Centre Head sends the selected centre; for a Centre Manager the backend uses their own centre
    const centerId = this.isCentreHead ? this.selectCenter : null;

    this.targetSrv.getQuantityBasedCollectionReport(centerId, this.fromDate, this.toDate).subscribe({
      next: (res) => {
        this.reportArr = res?.items || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load quantity-based collection report', err);
        this.reportArr = [];
        this.isLoading = false;
        this.toastSrv.error(err?.error?.error || 'Failed to load the report');
      },
    });
  }

  // ---------- Download ----------

  onDownload() {
    // TODO: hook up to the download endpoint once it is available
  }

  // ---------- Navigation ----------

  goBack() {
    this.router.navigate(['/reports']);
  }

  // ---------- Helpers ----------

  /** "2024-12-27" / "2024-12-27T..." -> "2024/12/27" */
  formatDate(date: string | null | undefined): string {
    const m = date?.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? `${m[1]}/${m[2]}/${m[3]}` : '--';
  }

  statusClass(status: string): string {
    switch (status) {
      case 'Completed': return 'bg-[#c0f8ac] text-[#30911a]';
      case 'Pending': return 'bg-[#F8FFA6] text-[#A8A100]';
      case 'Extra': return 'bg-[#FFE4C9] text-[#CD6700]';
      case 'Exceeded': return 'bg-[#C8E0FF] text-[#415CFF]';
      default: return 'bg-gray-100 text-gray-500';
    }
  }

  validityClass(validity: string | null): string {
    switch (validity) {
      case 'Active': return 'bg-[#BBFFC6] text-[#308233]';
      case 'Expired': return 'bg-[#DCDCDC] text-[#888888]';
      case 'Unassigned': return 'bg-[#AFF7FF] text-[#00808E]';
      default: return 'bg-gray-100 text-gray-500';
    }
  }
}

const DEFAULT_CENTER_ID = 59; // Colombo

class Center {
  id!: number;
  centerName!: string;
  regCode!: string;
}

// Matches the response of GET /target/get-quantity-based-collection-report
export interface QuantityCollectionRow {
  id: number;
  cropNameEnglish: string;
  varietyNameEnglish: string;
  grade: string;
  target: number;       // kg
  complete: number;     // kg
  assignStatus: number;
  targetDate: string;   // yyyy-MM-dd
  status: 'Completed' | 'Pending' | 'Extra' | 'Exceeded' | 'No Target' | string;
  validity: 'Active' | 'Expired' | 'Unassigned' | string | null;
}

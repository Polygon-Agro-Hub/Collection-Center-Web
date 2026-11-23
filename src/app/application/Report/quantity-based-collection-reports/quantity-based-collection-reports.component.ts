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
  fromDate: string = '';   // yyyy-MM-dd
  toDate: string = '';     // yyyy-MM-dd

  /** true once "Go" has been pressed with valid filters (same flag name as the Collection report) */
  isDateFilterSet = false;

  targetArr: QuantityCollectionRow[] = [];
  hasData: boolean = false;
  totalItems: number = 0;

  /** Filters used for the data currently on screen — Download uses these, not unsaved picker changes */
  private appliedFilters: { centerId: string | null; fromDate: string; toDate: string } | null = null;

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

  // ---------- Centre dropdown ----------

  getAllCenters() {
    this.manageOfficerSrv.getCCHOwnCenters().subscribe({
      next: (res) => {
        this.centerArr = res || [];
        // No default centre — the user must pick one
        this.selectCenter = '';
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

  onCenterSelectionChange(selectedValue: string | null) {
    if (selectedValue) {
      this.selectCenter = selectedValue;
      return;
    }

    // Centre cleared — dates depend on a centre, so clear them and the report shown
    this.selectCenter = '';
    this.clearFromDate();
    this.clearToDate();
    this.resetReport();
  }

  /** Centre Head must pick a centre before choosing dates */
  private ensureCenterSelected(): boolean {
    if (this.isCentreHead && !this.selectCenter) {
      this.toastSrv.warning('Please select a collection centre');
      return false;
    }
    return true;
  }

  // ---------- Dates (same behaviour as Reports > Collection) ----------

  onFromDateChange(date: string | Date | null) {
    const selectedDate = this.toDateString(date);

    if (selectedDate && !this.ensureCenterSelected()) {
      this.clearFromDate();
      return;
    }

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
    const selectedDate = this.toDateString(date);

    if (selectedDate && !this.ensureCenterSelected()) {
      this.clearToDate();
      return;
    }

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

  private clearFromDate() {
    this.fromDate = '';
    if (this.fromDatePicker) {
      this.fromDatePicker.selectedDate = null;
    }
  }

  /** Drop the report on screen so Download can't use filters for a cleared centre */
  private resetReport() {
    this.isDateFilterSet = false;
    this.appliedFilters = null;
    this.targetArr = [];
    this.hasData = false;
    this.totalItems = 0;
  }

  // ---------- Go ----------

  goBtn() {
    if (!this.ensureCenterSelected()) {
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
    this.appliedFilters = {
      // Centre Head sends the selected centre; for a Centre Manager the backend uses their own centre
      centerId: this.isCentreHead ? this.selectCenter : null,
      // Dates go to the backend as plain 'YYYY-MM-DD' strings
      fromDate: this.toDateString(this.fromDate),
      toDate: this.toDateString(this.toDate),
    };
    this.fetchAllTarget();
  }

  // ---------- Data fetching ----------

  fetchAllTarget() {
    if (!this.appliedFilters) return;
    const { centerId, fromDate, toDate } = this.appliedFilters;

    this.isLoading = true;
    this.targetSrv.getQuantityBasedCollectionReport(centerId, fromDate, toDate).subscribe({
      next: (res) => {
        this.targetArr = res?.items || [];
        this.totalItems = res?.totalPages || 0;
        this.hasData = this.targetArr.length > 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load quantity-based collection report', err);
        this.targetArr = [];
        this.hasData = false;
        this.isLoading = false;
        this.toastSrv.error(err?.error?.error || 'Failed to load the report');
      },
    });
  }

  // ---------- Download ----------

  onDownload() {
    if (!this.appliedFilters || this.isDownloading) return;
    const { centerId, fromDate, toDate } = this.appliedFilters;

    this.isDownloading = true;
    this.targetSrv.downloadQuantityBasedCollectionReport(centerId, fromDate, toDate).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.buildDownloadFileName(centerId, fromDate, toDate);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.isDownloading = false;
        this.toastSrv.success('Report downloaded successfully');
      },
      error: (err) => {
        console.error('Failed to download quantity-based collection report', err);
        this.isDownloading = false;
        this.toastSrv.error('Failed to download the report');
      },
    });
  }

  // "Qty Collection Report for [CENTRE NAME] - [FROM] to [TO].xlsx"
  // (Centre Managers have no centre list, so the "for [CENTRE NAME]" part is left out)
  private buildDownloadFileName(centerId: string | null, fromDate: string, toDate: string): string {
    const center = centerId ? this.centerArr.find(c => c.id.toString() === centerId) : null;
    // strip characters that aren't allowed in file names
    const centerName = center?.centerName?.replace(/[\\/:*?"<>|]/g, '').trim();
    const centerPart = centerName ? `${centerName}` : '';
    return `Quantity-Based Collection Report - ${centerPart} - ${fromDate} to ${toDate}.xlsx`;
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

  /** Date | "YYYY-MM-DD" | "YYYY-MM-DDT..." -> "YYYY-MM-DD" ('' when empty/invalid) */
  toDateString(value: string | Date | null | undefined): string {
    if (!value) return '';
    if (value instanceof Date) {
      if (isNaN(value.getTime())) return '';
      const y = value.getFullYear();
      const m = ('0' + (value.getMonth() + 1)).slice(-2);
      const d = ('0' + value.getDate()).slice(-2);
      return `${y}-${m}-${d}`;
    }
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : '';
  }

}

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
  validity: 'Active' | 'Expired' | 'Unassigned' | string | null;}

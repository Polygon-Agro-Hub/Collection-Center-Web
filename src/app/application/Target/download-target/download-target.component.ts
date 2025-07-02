import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';  // Import ToastrService
import { ToastrModule } from 'ngx-toastr';   // Import ToastrModule
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-download-target',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastrModule, LoadingSpinnerComponent],
  templateUrl: './download-target.component.html',
  styleUrls: ['./download-target.component.css'],
  providers: [DatePipe]
})
export class DownloadTargetComponent {
  targetArr!: DailyTargets[];

  fromDate: Date | string = '';
  toDate: Date | string = '';

  hasData: boolean = false;
  hasDataAndTime: boolean = false;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private TargetSrv: TargetService,
    private toastSrv: ToastAlertService
  ) { }

  fetchDownloadTarget() {
    this.isLoading = true;
    this.TargetSrv.downloadDailyTarget(this.fromDate, this.toDate).subscribe(
      (res: any) => {

        if (res) {
          this.targetArr = res.items || res.data || [];
          this.hasData = this.targetArr.length > 0;

          if (!this.hasData) {
            console.warn('No data received');
          }
        } else {
          console.error('Empty response received');
          this.hasData = false;
        }

        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching targets:', error);
        this.isLoading = false;
        this.hasData = false;

      }
    );
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
      Swal.fire({
        icon: "error",
        title: "No Date Input",
        text: 'Please Fill the Date Inputs first',
        customClass: {
          popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
          title: 'dark:text-white',
        }
      });
      this.hasDataAndTime = false;
      // this.toastSrv.warning("Please fill in all fields");
      return;
    }

    
    // if (!this.fromDate || !this.toDate) {
    //   this.toastSrv.warning("Please fill in all fields");
    //   return;
    // }
    this.hasDataAndTime = true;
    this.fetchDownloadTarget();
  }

  downloadXlSheet() {
    if (!this.targetArr || this.targetArr.length === 0) {
      this.toastSrv.error("No data available to export!");
      return;
    }

    const worksheetData = this.targetArr.map((item, index) => ({
      No: index + 1,
      'Crop Name': item.cropNameEnglish,
      'Variety Name': item.varietyNameEnglish,
      Grade: item.grade,
      'Target (kg)': item.target,
      'Completed (kg)': item.complete ?? '-',  // Handle null/undefined
      Status: item.status,
      Validity: item.validity,
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(worksheetData);

    // Set column widths (in characters)
    worksheet['!cols'] = [
      { wch: 5 },    // No (column A)
      { wch: 20 },   // Crop Name (column B)
      { wch: 20 },   // Variety Name (column C)
      { wch: 10 },   // Grade (column D)
      { wch: 12 },   // Target (kg) (column E)
      { wch: 15 },   // Completed (kg) (column F)
      { wch: 12 },   // Status (column G)
      { wch: 12 }    // Validity (column H)
    ];

    // Auto-filter (optional)
    worksheet['!autofilter'] = { ref: `A1:H${worksheetData.length + 1}` };

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Targets');

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, `Target-Report (${this.fromDate} - ${this.toDate}).xlsx`);
    this.toastSrv.success(`Target-Report (${this.fromDate} - ${this.toDate}).xlsx Downloaded`);
  }

}

class DailyTargets {
  cropNameEnglish!: string;
  varietyNameEnglish!: string;
  toDate!: string;
  toTime!: string;
  grade!: string;
  target!: string;
  complete!: string;
  status!: string;
  validity!: string;
}
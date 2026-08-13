import { CommonModule, DatePipe } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import { CustomDatepickerComponent } from '../../../components/custom-datepicker/custom-datepicker.component';

@Component({
  selector: 'app-download-target',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastrModule, CustomDatepickerComponent, LoadingSpinnerComponent],
  templateUrl: './download-target.component.html',
  styleUrls: ['./download-target.component.css'],
  providers: [DatePipe]
})
export class DownloadTargetComponent {
  @ViewChild('fromDatePicker') fromDatePicker!: any;
  @ViewChild('toDatePicker') toDatePicker!: any;

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

  // validateToDate() {
  //   // Case 1: User hasn't selected fromDate yet
  //   if (!this.fromDate) {
  //     this.toDate = ''; // Reset toDate
  //     this.toastSrv.warning("Please select the 'From' date first.");
  //     return;
  //   }

  //   // Case 2: toDate is earlier than fromDate
  //   if (this.toDate) {
  //     const from = new Date(this.fromDate);
  //     const to = new Date(this.toDate);

  //     if (to <= from) {
  //       this.toDate = ''; // Reset toDate
  //       this.toastSrv.warning("The 'To' date cannot be earlier than or same to the 'From' date.");
  //     }
  //   }
  // }

  // validateFromDate() {
  //   // Case 1: User hasn't selected fromDate yet
  //   if (!this.toDate) {
  //     return;
  //   }

  //   // Case 2: toDate is earlier than fromDate
  //   if (this.toDate) {
  //     const from = new Date(this.fromDate);
  //     const to = new Date(this.toDate);

  //     if (to <= from) {
  //       this.fromDate = ''; // Reset toDate
  //       this.toastSrv.warning("The 'From' date cannot be Later than or same to the 'From' date.");
  //     }
  //   }
  // }

  // onDateFromDateChange(newDate: string | Date | null) {
  //   let dateString: string;
  
  //   if (!newDate) {
      
  //     return
  //   }
  //   else if (newDate instanceof Date) {
      
  //     dateString = newDate.toISOString().split('T')[0];
  //   } 
  //   else {
      
  //     dateString = newDate;
  //   }

  //   if (!this.toDate) {
  //     return;
  //   }

  //   this.fromDate = dateString;

  //   // Case 2: toDate is earlier than fromDate
  //   if (this.toDate) {
  //     const from = new Date(this.fromDate);
  //     const to = new Date(this.toDate);

  //     if (to <= from) {
  //       this.fromDate = ''; // Reset toDate
  //       newDate = '';
  //       this.toastSrv.warning("The 'From' date cannot be Later than or same to the 'From' date.");
  //     }
  //   }
  
  // }

onDateFromDateChange(newDate: string | Date | null) {
    let dateString: string;

    if (!newDate) {
      this.fromDate = '';
      return;
    } else if (newDate instanceof Date) {
      dateString = newDate.toISOString().split('T')[0];
    } else {
      dateString = newDate;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [y, m, d] = dateString.split('-').map(Number);
    const selectedFrom = new Date(y, m - 1, d);

    if (selectedFrom > today) {
      this.fromDate = '';
      this.toastSrv.warning("From Date cannot be a future date.");
      // Clear the datepicker by resetting the selected date
      if (this.fromDatePicker) {
        this.fromDatePicker.selectedDate = null;
        this.fromDatePicker.writeValue(null);
      }
      return;
    }

    this.fromDate = dateString;

    if (!this.toDate) {
      return;
    }

    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);

    if (to <= from) {
      this.fromDate = '';
      this.toastSrv.warning("The 'From' date cannot be later than or the same as the 'To' date.");
      // Clear the datepicker
      if (this.fromDatePicker) {
        this.fromDatePicker.selectedDate = null;
        this.fromDatePicker.writeValue(null);
      }
    }
  }

  onDateToDateChange(newDate: string | Date | null) {
    let dateString: string;

    if (!newDate) {
      this.toDate = '';
      return;
    } else if (newDate instanceof Date) {
      dateString = newDate.toISOString().split('T')[0];
    } else {
      dateString = newDate;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [y, m, d] = dateString.split('-').map(Number);
    const selectedTo = new Date(y, m - 1, d);

    if (selectedTo > today) {
      this.toDate = '';
      this.toastSrv.warning("To Date cannot be a future date.");
      if (this.toDatePicker) {
        this.toDatePicker.selectedDate = null;
        this.toDatePicker.writeValue(null);
      }
      return;
    }

    this.toDate = dateString;

    if (!this.fromDate) {
      this.toDate = '';
      this.toastSrv.warning("Please select the 'From' date first.");
      if (this.toDatePicker) {
        this.toDatePicker.selectedDate = null;
        this.toDatePicker.writeValue(null);
      }
      return;
    }

    if (this.toDate) {
      const from = new Date(this.fromDate);
      const to = new Date(this.toDate);

      if (to <= from) {
        this.toDate = '';
        this.toastSrv.warning("The 'To' date cannot be earlier than or same to the 'From' date.");
        if (this.toDatePicker) {
          this.toDatePicker.selectedDate = null;
          this.toDatePicker.writeValue(null);
        }
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

    console.log('ta', this.targetArr)

    const worksheetData = this.targetArr.map((item, index) => ({
  No: index + 1,
  'Crop Name': item.cropNameEnglish,
  'Variety Name': item.varietyNameEnglish,
  Grade: item.grade,
  'Target (kg)': item.target ? item.target : '-',
  'Completed (kg)': item.complete ? item.complete : '-',
  'Target Date': item.date
    ? new Date(item.date).toISOString().split('T')[0].replace(/-/g, '/')
    : '',
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
    this.toastSrv.success(`File Downloaded Successfully`);
  }

}

class DailyTargets {
  cropNameEnglish!: string;
  varietyNameEnglish!: string;
  toDate!: string;
  toTime!: string;
  grade!: string;
  date!: Date;
  target!: string;
  complete!: string;
  status!: string;
  validity!: string;
}
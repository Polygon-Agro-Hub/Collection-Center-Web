import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';  // Import ToastrService
import { ToastrModule } from 'ngx-toastr';   // Import ToastrModule

@Component({
  selector: 'app-download-target',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastrModule],  // Add ToastrModule here
  templateUrl: './download-target.component.html',
  styleUrls: ['./download-target.component.css']
})
export class DownloadTargetComponent {
  targetArr!: DailyTargets[];

  fromDate: Date | string = '';
  toDate: Date | string = '';

  hasData: boolean = false;

  toaster = inject(ToastrService);  // Inject ToastrService

  constructor(
    private router: Router,
    private TargetSrv: TargetService
  ) { }

  fetchDownloadTarget() {
    this.TargetSrv.downloadDailyTarget(this.fromDate, this.toDate).subscribe(
      (res) => {
        if (res.status) {
          this.targetArr = res.data;
          this.hasData = res.data.length > 0;
        } else {
          this.hasData = false;
        }
      }
    );
  }

  goBtn() {
    if (!this.fromDate || !this.toDate) {
      this.toaster.error('Please fill in all fields', 'Error',{
        positionClass: 'toast-bottom-right'
      });
      return; 
    }

    this.fetchDownloadTarget();
    this.toaster.success('Data fetched successfully!', 'Success'); // Show success toast
  }

  downloadXlSheet() {
    if (!this.targetArr || this.targetArr.length === 0) {
      this.toaster.error('No data available to export.', 'Error');
      return;
    }

    const worksheetData = this.targetArr.map((item, index) => ({
      No: index + 1,
      'Crop Name': item.cropNameEnglish,
      'Variety Name': item.varietyNameEnglish,
      Grade: item.grade,
      'Target (kg)': item.TargetQty,
      'Completed (kg)': item.CompleteQty,
      Status: item.status,
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Targets');
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, `Target-Report (${this.fromDate} - ${this.toDate}).xlsx`);
  }
}

class DailyTargets {
  cropNameEnglish!: string;
  varietyNameEnglish!: string;
  toDate!: string;
  toTime!: string;
  grade!: string;
  TargetQty!: string;
  CompleteQty!: string;
  status!: string;
}

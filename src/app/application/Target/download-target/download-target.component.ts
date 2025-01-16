import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-download-target',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './download-target.component.html',
  styleUrl: './download-target.component.css'
})
export class DownloadTargetComponent {
  targetArr!: DailyTargets[];

  fromDate: Date | string = '';
  toDate: Date | string = '';

  hasData: boolean = false;

  constructor(
    private router: Router,
    private TargetSrv: TargetService
  ) { }


  fetchDownloadTarget() {
    this.TargetSrv.downloadDailyTarget(this.fromDate, this.toDate).subscribe(
      (res) => {
        if (res.status) {
          this.targetArr = res.data
          if (res.data.length > 0) {
            this.hasData = true
          } else {
            this.hasData = false
          }
        } else {
          this.hasData = false;
        }
      }
    )
  }

  goBtn() {
    if (!this.fromDate || !this.toDate) {
      return console.log("error fill all feild");

    }
    this.fetchDownloadTarget();
  }



  downloadXlSheet() {
    if (!this.targetArr || this.targetArr.length === 0) {
      console.log('No data available to export.');
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

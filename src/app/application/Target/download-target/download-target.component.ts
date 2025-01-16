import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';

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

  downloadXlSheet(){
    
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

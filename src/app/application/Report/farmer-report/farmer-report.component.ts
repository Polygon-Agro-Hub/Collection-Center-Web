import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportServiceService } from '../../../services/Report-service/report-service.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-farmer-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './farmer-report.component.html',
  styleUrl: './farmer-report.component.css',
  // providers: [DatePipe]

})
export class FarmerReportComponent implements OnInit {
  userObj: User = new User();
  CropArr!: Crop[];

  reportId!: number
  hasData: boolean = false
  totalAmount: number = 0


  constructor(
    private router: Router,
    private ReportSrv: ReportServiceService,
    private route: ActivatedRoute,
    // private datePipe: DatePipe

  ) { }

  ngOnInit(): void {
    this.reportId = this.route.snapshot.params['id'];
    this.fetchFarmerDetails(this.reportId);
  }

  fetchFarmerDetails(id: number) {
    this.ReportSrv.getFarmerReport(id).subscribe(
      (res) => {
        if (res.status) {
          this.userObj = res.user;
          this.CropArr = res.crops;
          this.hasData = true;
        } else {
          this.hasData = false;
        }
      }
    )
  }

  calculeteTotal(priceA: number, qtyA: number, priceB: number, qtyB: number, priceC: number, qtyC: number) :number{
    let tot = priceA * qtyA + priceB * qtyB + priceC * qtyC
    this.totalAmount += tot;
    return tot;
  }

  downloadReport() {
    const element = document.getElementById('reportContainer'); // Ensure this selector matches the report container
    if (!element) {
      alert('Report content not found.');
      return;
    }

    html2canvas(element, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // A4 width minus margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`Farmer_Report_${this.reportId}.pdf`);
    }).catch((error) => {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the report. Please try again.');
    });
  }

}

class User {
  id!: number
  firstName!: string
  lastName!: string
  phoneNumber!: string
  NICnumber!: string
  houseNo!: string
  streetName!: string
  city!: string
  district!: string
  accNumber!: string
  accHolderName!: string
  bankName!: string
  branchName!: string
  createdAt!: string
}

class Crop {
  id!: number
  cropNameEnglish!: string
  varietyNameEnglish!: string
  gradeAprice!: number
  gradeBprice!: number
  gradeCprice!: number
  gradeAquan!: number
  gradeBquan!: number
  gradeCquan!: number

}

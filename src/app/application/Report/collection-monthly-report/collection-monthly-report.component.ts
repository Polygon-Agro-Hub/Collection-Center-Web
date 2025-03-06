import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportServiceService } from '../../../services/Report-service/report-service.service';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-collection-monthly-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './collection-monthly-report.component.html',
  styleUrl: './collection-monthly-report.component.css',
  providers: [DatePipe]

})
export class CollectionMonthlyReportComponent implements OnInit {
  officerDataObj: OfficerDetails = new OfficerDetails();
  farmerDataArr!: FarmerDetails[]
  officerId!: number;
  currentDate: Date = new Date();
  startDate: Date = new Date();
  endDate: Date = new Date();

  hasData: boolean = false;

  constructor(
    private ReportSrv: ReportServiceService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.officerId = this.route.snapshot.params['id'];
    setInterval(() => {
      this.currentDate = new Date();
    }, 5000);
  }

  fetchOfficerData() {
    this.ReportSrv.getCollectionmonthlyReportOfficerData(this.officerId,this.startDate,this.endDate).subscribe(
      (res) => {
        this.officerDataObj = res.officer;
        this.farmerDataArr = res.dates;
        if(res.dates.length > 0){
          this.hasData = true;
        }else{
          this.hasData = false;
        } 
      },
      (err) => {
        this.hasData = false;
      }
    )
  }

  filterDate(){
    this.fetchOfficerData();
  }


startDateValidation() {
  const today = new Date();
  const selectedDate = new Date(this.startDate);

  if (selectedDate > today) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Date',
      text: 'Start date cannot be a future date.',
      confirmButtonText: 'OK',
    });

    this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }
}

endDateValidation() {
  const today = new Date();
  const selectedEndDate = new Date(this.endDate);

  if (!this.startDate) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Start Date',
      text: 'Please select a start date before selecting an end date.',
      confirmButtonText: 'OK',
    });

    this.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());;
    return;
  }

  if (selectedEndDate > today) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid End Date',
      text: 'End date cannot be a future date.',
      confirmButtonText: 'OK',
    });

    this.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());;
  }
}


downloadReport() {
  const element = document.getElementById('reportContainer'); // Ensure the report div has this ID
  if (!element) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Unable to find report content to download.',
      confirmButtonText: 'OK',
    });
    return;
  }

  // Increase the scale for better clarity and size
  const scaleFactor = 3; // Adjust this value for higher clarity and larger size
  
  html2canvas(element, { scale: scaleFactor }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Dynamically calculate dimensions based on the canvas size and desired A4 format
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Save the PDF with a descriptive filename
    const fileName = `${this.officerDataObj.empId}_Collection_Monthly_Report(${this.startDate}to${this.endDate}).pdf`;
    pdf.save(fileName);
  }).catch((error) => {
    console.error('Error generating PDF:', error);
    Swal.fire({
      icon: 'error',
      title: 'Download Failed',
      text: 'An error occurred while generating the report. Please try again.',
      confirmButtonText: 'OK',
    });
  });
}


  

}

class OfficerDetails {
  id!: number
  firstNameEnglish!: string
  lastNameEnglish!: string
  jobRole!: string
  empId!: string
  TotalQty!: string
  TotalFarmers!: string
}

class FarmerDetails {
  ReportDate!: string
  TotalQty!: string
  TotalFarmers!: string
}

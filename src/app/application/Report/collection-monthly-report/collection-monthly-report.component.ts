import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportServiceService } from '../../../services/Report-service/report-service.service';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-collection-monthly-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './collection-monthly-report.component.html',
  styleUrl: './collection-monthly-report.component.css',
  providers: [DatePipe]

})
export class CollectionMonthlyReportComponent implements OnInit {
  officerDataObj: OfficerDetails = new OfficerDetails();
  farmerDataArr!: FarmerDetails[]
  officerId!: number;
  currentDate: Date = new Date();
  startDate!: Date ;
  endDate!: Date;
  maxDate: string = new Date().toISOString().split('T')[0];

  hasData: boolean = false;
  isLoading: boolean = false;

  constructor(
    private ReportSrv: ReportServiceService,
    private route: ActivatedRoute,
    private toastSrv: ToastAlertService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.officerId = this.route.snapshot.params['id'];
    setInterval(() => {
      this.currentDate = new Date();
    }, 5000);
  }

  fetchOfficerData() {
    this.isLoading = true
    this.ReportSrv.getCollectionmonthlyReportOfficerData(this.officerId, this.startDate, this.endDate).subscribe(
      (res) => {
        this.officerDataObj = res.officer;
        this.farmerDataArr = res.dates;
        if (res.dates.length > 0) {
          this.hasData = true;
        } else {
          this.hasData = false;
        }
        this.isLoading = false;
      },
      (err) => {
        this.hasData = false;
        this.isLoading = false;

      }
    )
  }

  filterDate() {

    console.log('filterung')
    const startEntered = !!this.startDate;
    const endEntered = !!this.endDate;

    console.log(this.startDate, this.endDate)
  
    if (startEntered && endEntered) {
      this.fetchOfficerData();
    } else {
      let msg = '';
  
      if (!startEntered && !endEntered) {
        msg = 'Please enter both Start Date and End Date.';
      } else if (!startEntered) {
        msg = 'Please enter the Start Date.';
      } else if (!endEntered) {
        msg = 'Please enter the End Date.';
      }
  
      Swal.fire({
        icon: 'warning',
        title: 'Missing Date Input',
        text: msg,
        confirmButtonText: 'OK'
      });
    }
  }
  

  navigateToReports() {
    this.router.navigate(['/reports']); // Change '/reports' to your desired route
  }


  startDateValidation() {
    const today = new Date();
    const selectedDate = new Date(this.startDate);

    // Check if start date is in the future
    if (selectedDate > today) {
      this.toastSrv.warning('<b>Start date</b> cannot be a future date.');
      this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return;
    }

    // Check if end date is already selected and start date is after end date
    if (this.endDate && selectedDate > new Date(this.endDate)) {
      this.toastSrv.warning('<b>Start date</b> cannot be after the selected end date.');
      this.startDate = new Date(this.endDate);
    }
  }

  endDateValidation() {
    const today = new Date();
    const selectedEndDate = new Date(this.endDate);

    if (!this.startDate) {
      this.toastSrv.success('Please select a <b>start date</b> before selecting an end date.')

      this.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());;
      return;
    }

    if (selectedEndDate > today) {

      this.toastSrv.error('<b>End date cannot be a future date.')
      this.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());;
    }
  }



  downloadReport(): void {
    // Create new jsPDF instance
    const doc = new jsPDF();

    // Set document properties
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    // Helper function to add a bordered field
    const addField = (label: string, value: string, x: number, y: number, width: number): number => {
      const height = 10;
      const borderRadius = 2;
      const labelWidth = width / 3;
    
      // Set border color to #D9D9D9 and draw rounded rectangle
      doc.setDrawColor(217, 217, 217);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, y, width, height, borderRadius, borderRadius, 'S');
    
      // Divider line between label and value
      doc.line(x + labelWidth, y, x + labelWidth, y + height);
    
      // Set text font and color
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(41, 41, 41);  // #292929
    
      // Add label and value text
      doc.text(label, x + 2, y + 6);
      doc.text(value, x + labelWidth + 2, y + 6);
    
      return y + height;
    };
    

    // Add title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor('#292929');
    doc.text('Collection Officer Report', pageWidth / 2, y, { align: 'center' });
    y += 10;

    // Draw the outer container
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(250, 250, 250);
    // doc.roundedRect(margin, y, contentWidth, 120, 3, 3, 'S');
    y += 5;

    // First row - From date and To date
    const halfWidth = contentWidth / 2 - 5;
    let leftY = addField('From', String(this.startDate), margin + 5, y, halfWidth);
    let rightY = addField('To', String(this.endDate), margin + halfWidth + 10, y, halfWidth);
    y = Math.max(leftY, rightY) + 5;

    // Second row - EMP ID and Role
    leftY = addField('EMP ID', this.officerDataObj.empId, margin + 5, y, halfWidth);
    rightY = addField('Role', this.officerDataObj.jobRole, margin + halfWidth + 10, y, halfWidth);
    y = Math.max(leftY, rightY) + 5;

    // Third row - First Name and Last Name
    leftY = addField('First Name', this.officerDataObj.firstNameEnglish, margin + 5, y, halfWidth);
    rightY = addField('Last Name', this.officerDataObj.lastNameEnglish, margin + halfWidth + 10, y, halfWidth);
    y = Math.max(leftY, rightY) + 5;

    // Fourth row - Weight and Farmer
    leftY = addField('Weight', String(this.officerDataObj.TotalQty) + ' kg', margin + 5, y, halfWidth);
    rightY = addField('Farmer', String(this.officerDataObj.TotalFarmers), margin + halfWidth + 10, y, halfWidth);
    y = Math.max(leftY, rightY) + 15;

    // Table
    // Table header
    const colWidths = [contentWidth * 0.3, contentWidth * 0.35, contentWidth * 0.35];
const startX = margin + 5;

// Table header background and border
doc.setFillColor(228, 220, 211); // #E4DCD3
doc.setDrawColor(130, 130, 130); // #828282

// Header rectangles
doc.rect(startX, y, colWidths[0], 10, 'FD');
doc.rect(startX + colWidths[0], y, colWidths[1], 10, 'FD');
doc.rect(startX + colWidths[0] + colWidths[1], y, colWidths[2], 10, 'FD');

// Header text
doc.setTextColor(0, 0, 0); // #000000
doc.setFont('helvetica', 'bold');
doc.setFontSize(10);
doc.text('Date', startX + colWidths[0] / 2, y + 6, { align: 'center' });
doc.text('Total Weight', startX + colWidths[0] + colWidths[1] / 2, y + 6, { align: 'center' });
doc.text('Total Farmers', startX + colWidths[0] + colWidths[1] + colWidths[2] / 2, y + 6, { align: 'center' });

y += 10;

// Table body
this.farmerDataArr.forEach(row => {
  doc.setDrawColor(130, 130, 130); // border #828282
  doc.setFont('helvetica', 'normal'); // not bold
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0); // text color black

  // Rectangles for each column
  doc.rect(startX, y, colWidths[0], 10, 'S');
  doc.rect(startX + colWidths[0], y, colWidths[1], 10, 'S');
  doc.rect(startX + colWidths[0] + colWidths[1], y, colWidths[2], 10, 'S');

  // Format date
  const formattedDate = row.ReportDate
    ? new Date(row.ReportDate).toISOString().split('T')[0].replace(/-/g, '-')
    : '-';

  // Body text
  doc.text(formattedDate, startX + colWidths[0] / 2, y + 6, { align: 'center' });
  doc.text(String(row.TotalQty) + ' kg', startX + colWidths[0] + colWidths[1] / 2, y + 6, { align: 'center' });
  doc.text(String(row.TotalFarmers), startX + colWidths[0] + colWidths[1] + colWidths[2] / 2, y + 6, { align: 'center' });

  y += 10;
});

    y += 10;
    // Timestamp
    doc.setFontSize(8);
    doc.setTextColor(62, 62, 62);
    const currentDate = new Date();
    const timestamp = `This report is generated on ${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')} at ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')} ${currentDate.getHours() >= 12 ? 'PM' : 'AM'}`;
    doc.text(timestamp, margin + 5, y);

    // Save the PDF
    const fileName = `collection_officer_report(${this.officerDataObj.empId}_from_${this.startDate}_to_${this.endDate}).pdf`;
    doc.save(fileName);

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

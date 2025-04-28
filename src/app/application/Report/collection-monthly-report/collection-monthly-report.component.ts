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
  startDate: Date = new Date();
  endDate: Date = new Date();

  hasData: boolean = false;
  isLoading: boolean = false;

  constructor(
    private ReportSrv: ReportServiceService,
    private route: ActivatedRoute,
    private toastSrv:ToastAlertService,
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
    if (this.startDate && this.endDate) {
      this.fetchOfficerData();
    }
  }

  navigateToReports() {
    this.router.navigate(['/reports']); // Change '/reports' to your desired route
  }


  startDateValidation() {
    const today = new Date();
    const selectedDate = new Date(this.startDate);

    if (selectedDate > today) {
      // Swal.fire({
      //   icon: 'error',
      //   title: 'Invalid Date',
      //   text: 'Start date cannot be a future date.',
      //   confirmButtonText: 'OK',
      // });
      this.toastSrv.warning('<b>Start date</b> cannot be a future date.')
      this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }
  }

  endDateValidation() {
    const today = new Date();
    const selectedEndDate = new Date(this.endDate);

    if (!this.startDate) {
      // Swal.fire({
      //   icon: 'warning',
      //   title: 'Missing Start Date',
      //   text: 'Please select a start date before selecting an end date.',
      //   confirmButtonText: 'OK',
      // });
      this.toastSrv.success('Please select a <b>start date</b> before selecting an end date.')

      this.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());;
      return;
    }

    if (selectedEndDate > today) {
      // Swal.fire({
      //   icon: 'error',
      //   title: 'Invalid End Date',
      //   text: 'End date cannot be a future date.',
      //   confirmButtonText: 'OK',
      // });

      this.toastSrv.error('<b>End date cannot be a future date.')
      this.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());;
    }
  }



  downloadReport(): void {
    console.log('downloading', this.startDate, this.endDate)
    // Create new jsPDF instance
    const doc = new jsPDF();

    // Set document properties
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    // Helper function to add a bordered field
    const addField = (label: string, value: string, x: number, y: number, width: number): number => {
      // Draw rectangle
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(255, 255, 255);
      doc.rect(x, y, width, 10, 'S');

      // Draw divider line
      const labelWidth = width / 3;
      doc.line(x + labelWidth, y, x + labelWidth, y + 10);

      // Add label text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(label, x + 2, y + 6);

      // Add value text
      doc.text(value, x + labelWidth + 2, y + 6);

      return y + 10;
    };

    // Add title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Collection Officer Report', pageWidth / 2, y, { align: 'center' });
    y += 15;

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
    leftY = addField('Weight', String(this.officerDataObj.TotalQty), margin + 5, y, halfWidth);
    rightY = addField('Farmer', String(this.officerDataObj.TotalFarmers), margin + halfWidth + 10, y, halfWidth);
    y = Math.max(leftY, rightY) + 15;

    // Table
    // Table header
    const colWidths = [contentWidth * 0.3, contentWidth * 0.35, contentWidth * 0.35];
    const startX = margin + 5;

    // Header row
    doc.setFillColor(150, 150, 150);
    doc.rect(startX, y, colWidths[0], 10, 'F');
    doc.rect(startX + colWidths[0], y, colWidths[1], 10, 'F');
    doc.rect(startX + colWidths[0] + colWidths[1], y, colWidths[2], 10, 'F');

    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Date', startX + colWidths[0] / 2, y + 6, { align: 'center' });
    doc.text('Total Weight', startX + colWidths[0] + colWidths[1] / 2, y + 6, { align: 'center' });
    doc.text('Total Farmers', startX + colWidths[0] + colWidths[1] + colWidths[2] / 2, y + 6, { align: 'center' });
    y += 10;

    // Table data rows
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    this.farmerDataArr.forEach(row => {
      doc.setDrawColor(200, 200, 200);
      doc.rect(startX, y, colWidths[0], 10, 'S');
      doc.rect(startX + colWidths[0], y, colWidths[1], 10, 'S');
      doc.rect(startX + colWidths[0] + colWidths[1], y, colWidths[2], 10, 'S');

      // Format the date
      const formattedDate = row.ReportDate
        ? new Date(row.ReportDate).toISOString().split('T')[0].replace(/-/g, '-')
        : '-';

      doc.text(formattedDate, startX + colWidths[0] / 2, y + 6, { align: 'center' });
      doc.text(String(row.TotalQty), startX + colWidths[0] + colWidths[1] / 2, y + 6, { align: 'center' });
      doc.text(String(row.TotalFarmers), startX + colWidths[0] + colWidths[1] + colWidths[2] / 2, y + 6, { align: 'center' });

      y += 10;
    });

    y += 10;
    // Timestamp
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const currentDate = new Date();
    const timestamp = `This report is generated on ${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')} at ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')} ${currentDate.getHours() >= 12 ? 'PM' : 'AM'}`;
    doc.text(timestamp, margin + 5, y);

    // Save the PDF
    doc.save('collection_officer_report.pdf');
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

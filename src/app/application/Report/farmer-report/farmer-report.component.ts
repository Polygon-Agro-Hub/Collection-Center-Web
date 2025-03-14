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
  providers: [DatePipe]

})
export class FarmerReportComponent implements OnInit {
  userObj: User = new User();
  CropArr!: Crop[];

  reportId!: number
  hasData: boolean = false
  totalAmount: number = 0
  totalAmountforReport: number = 0;


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
          this.calculateOverallTotal(); // Calculate total here
        } else {
          this.hasData = false;
        }
      }
    );
  }
  
  calculateOverallTotal(): void {
    // Reset totalAmount before calculating
    this.totalAmount = this.CropArr.reduce((sum, item) => {
      return sum + this.calculateRowTotal(item);
    }, 0);
  }
  

  calculeteTotal(priceA: number, qtyA: number, priceB: number, qtyB: number, priceC: number, qtyC: number) :number{
    let tot = priceA * qtyA + priceB * qtyB + priceC * qtyC
    this.totalAmount += tot;
    console.log(this.totalAmount);
    
    return tot;
  }

  calculateRowTotal(item: Crop): number {
    return item.gradeAprice * item.gradeAquan +
           item.gradeBprice * item.gradeBquan +
           item.gradeCprice * item.gradeCquan;
  }

  calculateRowTotalforReport(crop: Crop): number {
    return  crop.gradeAprice * crop.gradeAquan +
            crop.gradeBprice * crop.gradeBquan +
            crop.gradeCprice * crop.gradeCquan;
  }

  calculateOverallTotalforReport(): number {
    // Calculate and return the total amount without modifying class properties
    return this.CropArr.reduce((sum, crop) => {
      return sum + this.calculateRowTotalforReport(crop);
    }, 0);
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
      pdf.save(`Farmer_Report_${this.userObj.invNo}.pdf`);
    }).catch((error) => {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the report. Please try again.');
    });
  }

  //this code works correctly but did not had time to fix the address display
  // downloadReport(): void {
  //   // Create new PDF document
  //   const doc = new jsPDF();
    
  //   // Helper function to format null values
  //   const formatValue = (value: any): string => {
  //     return value === null || value === undefined ? 'N/A' : value.toString();
  //   };

  //   // Set font
  //   doc.setFont('helvetica');
    
  //   // Add title
  //   doc.setFontSize(16);
  //   doc.text('INVOICE', 105, 15, { align: 'center' });
    
  //   // Add invoice details
  //   doc.setFontSize(10);
  //   doc.text(`INV NO: ${formatValue(this.userObj.invNo)}`, 14, 25);
  //   doc.text(`Date: ${formatValue(this.userObj.createdAt)}`, 14, 30);
    
  //   // Add Personal Details section
  //   doc.setFontSize(12);
  //   doc.text('Personal Details', 14, 40);
  //   doc.setFontSize(10);
    
  //   // Draw Personal Details table
  //   this.drawTable(doc, 14, 45, [
  //     ['First Name', 'Last Name', 'NIC Number', 'Phone Number', 'Address'],
  //     [
  //       formatValue(this.userObj.firstName),
  //       formatValue(this.userObj.lastName),
  //       formatValue(this.userObj.NICnumber),
  //       formatValue(this.userObj.phoneNumber),
  //       // formatValue(this.userObj.address)
  //     ]
  //   ]);
    
  //   // Add Bank Details section
  //   doc.setFontSize(12);
  //   doc.text('Bank Details', 14, 70);
  //   doc.setFontSize(10);
    
  //   // Draw Bank Details table
  //   this.drawTable(doc, 14, 75, [
  //     ['Account Number', 'Account Holder\'s Name', 'Bank Name', 'Branch Name'],
  //     [
  //       formatValue(this.userObj.accNumber),
  //       formatValue(this.userObj.accHolderName),
  //       formatValue(this.userObj.bankName),
  //       formatValue(this.userObj.branchName)
  //     ]
  //   ]);
    
  //   // Add Crop Details section
  //   doc.setFontSize(12);
  //   doc.text('Crop Details', 14, 100);
  //   doc.setFontSize(10);
    
  //   // Prepare crop details data for table
  //   const cropTableHeaders = ['Crop Name', 'Variety', 'Unit Price (A)', 'Quantity', 'Unit Price (B)', 
  //                             'Quantity', 'Unit Price (C)', 'Quantity', 'Total'];
                              
  //   const cropTableData = this.CropArr.map(crop => [
  //     formatValue(crop.cropNameEnglish),
  //     formatValue(crop.varietyNameEnglish),
  //     formatValue(crop.gradeAprice),
  //     formatValue(crop.gradeAquan),
  //     formatValue(crop.gradeBprice),
  //     formatValue(crop.gradeBquan),
  //     formatValue(crop.gradeCprice),
  //     formatValue(crop.gradeCquan),
  //     formatValue(this.calculateRowTotalforReport(crop))
  //   ]);
    
  //   // Draw Crop Details table
  //   this.drawTable(doc, 14, 105, [cropTableHeaders, ...cropTableData]);
    
  //   // Add Full Total
  //   doc.text('Full Total(Rs.): '+ this.calculateOverallTotalforReport(), 14, 135);
    
  //   // Save the PDF
  //   doc.save('invoice.pdf');
  // }

  // Helper function to draw tables
  private drawTable(doc: jsPDF, x: number, y: number, data: string[][]): void {
    // Calculate column widths based on number of columns
    const pageWidth = doc.internal.pageSize.width - 28; // Margins on both sides
    const colWidth = pageWidth / data[0].length;
    
    // Draw headers
    doc.setFillColor(240, 240, 240);
    doc.rect(x, y, pageWidth, 7, 'F');
    doc.setFont('bold');
    
    data[0].forEach((header, i) => {
      doc.text(header, x + i * colWidth + colWidth / 2, y + 5, { align: 'center' });
    });
    
    // Draw data rows
    doc.setFont('normal');
    for (let i = 1; i < data.length; i++) {
      const rowY = y + 7 * i;
      
      // Draw row background (alternating colors for better readability)
      if (i % 2 === 0) {
        doc.setFillColor(252, 252, 252);
        doc.rect(x, rowY, pageWidth, 7, 'F');
      }
      
      // Draw cell borders
      doc.setDrawColor(200, 200, 200);
      doc.rect(x, rowY, pageWidth, 7);
      
      // Draw vertical lines for columns
      for (let j = 1; j < data[0].length; j++) {
        doc.line(x + j * colWidth, rowY, x + j * colWidth, rowY + 7);
      }
      
      // Draw cell contents
      data[i].forEach((cell, j) => {
        doc.text(cell, x + j * colWidth + colWidth / 2, rowY + 5, { align: 'center' });
      });
    }
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
  farmerQr!: string
  officerQr!: string
  accHolderName!: string
  bankName!: string
  branchName!: string
  createdAt!: string
  invNo!:string
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

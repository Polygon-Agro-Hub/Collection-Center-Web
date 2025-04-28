import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportServiceService } from '../../../services/Report-service/report-service.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-farmer-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './farmer-report.component.html',
  styleUrl: './farmer-report.component.css',
  providers: [DatePipe]

})
export class FarmerReportComponent implements OnInit {
  userObj: User = new User();
  CropArr!: Crop[];

  reportId!: number
  hasData: boolean = false;
  totalAmount: number = 0;
  totalAmountforReport: number = 0;
  isLoading:boolean = true;


  constructor(
    private router: Router,
    private ReportSrv: ReportServiceService,
    private route: ActivatedRoute,
    // private datePipe: DatePipe

  ) { }

  ngOnInit(): void {
    this.reportId = this.route.snapshot.params['id'];
    console.log(this.reportId);
    this.fetchFarmerDetails(this.reportId);
  }

  fetchFarmerDetails(id: number) {
    this.isLoading = true
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
        this.isLoading = false;
      }
    );
  }
  
  calculateOverallTotal(): void {
    // Reset totalAmount before calculating
    this.totalAmount = this.CropArr.reduce((sum, item) => {
      return sum + this.calculateRowTotal(item);
    }, 0);
  }

  navigateToReports() {
    this.router.navigate(['/reports']); // Change '/reports' to your desired route
  }

  navigateToOfficerReports() {
    this.router.navigate(['/reports/officer-reports']); // Change '/reports' to your desired route
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
  

  // this code works correctly but did not had time to fix the address display
  async downloadReport() {
    // Create new PDF document
    this.isLoading = true;
    const doc = new jsPDF();

    // Helper function to format null values
    const formatValue = (value: any): string => {
      return value === null || value === undefined ? 'N/A' : value.toString();
    };

    const formatValueForAmounts = (value: any): string => {
      return value === null || value === undefined ? '0.00' : value.toString();
    };

    // Helper function to split text into multiple lines
    const splitTextIntoLines = (text: string, maxWidth: number): string[] => {
      return doc.splitTextToSize(text, maxWidth);
    };

    // Dynamic table drawing function
    const drawDynamicTable = (
      data: any[][],
      startX: number,
      startY: number,
      columnWidths: number[],
      lineHeight: number = 7, // Increased from 5 to 7 for better spacing
      padding: number = 3 // Increased from 2 to 3
    ): number => {
      let currentY = startY;
      
      data.forEach((row) => {
        let maxLines = 1;
        const cellLines: string[][] = [];
        
        // First determine how many lines we need for this row
        row.forEach((cell, colIndex) => {
          const cellContent = cell.toString();
          const maxCellWidth = columnWidths[colIndex] - padding * 2;
          const lines = splitTextIntoLines(cellContent, maxCellWidth);
          cellLines.push(lines);
          maxLines = Math.max(maxLines, lines.length);
        });
    
        // Calculate total row height
        const rowHeight = maxLines * lineHeight + padding * 2;
        
        // Draw each cell with the correct number of lines
        let currentX = startX;
        row.forEach((cell, colIndex) => {
          // Draw cell border
          doc.rect(
            currentX,
            currentY,
            columnWidths[colIndex],
            rowHeight
          );
          
          // Draw text (centered vertically)
          const lines = cellLines[colIndex];
          const textHeight = lines.length * lineHeight;
          const verticalOffset = (rowHeight - textHeight) / 1.5;
          
          lines.forEach((line, lineIndex) => {
            doc.text(
              line,
              currentX + padding,
              currentY + verticalOffset + (lineIndex * lineHeight) + padding
            );
          });
          
          currentX += columnWidths[colIndex];
        });
    
        currentY += rowHeight;
      });
    
      return currentY;
    };

    // Initialize position variables
    let x = 14;  // Starting x position
    let y = 15;  // Starting y position
    const yIncrement = 5;  // Standard increment for y position

    // Set font
    doc.setFont('helvetica');

    // Add title
    // doc.setFontSize(16);
    // doc.text('INVOICE', 105, y, { align: 'center' });
    // y += yIncrement * 2;

    // Add invoice details
    doc.setFontSize(10);
    doc.text(`INV NO: ${formatValue(this.userObj.invNo)}`, x, y);
    y += yIncrement;
    doc.text(`Date: ${new Date(this.userObj.createdAt).toISOString().split('T')[0].replace(/-/g, '/')}`, x, y);
    y += yIncrement * 2;

    // Add Personal Details section
    y += yIncrement*0.25;
    doc.setFontSize(12);
    doc.text('Personal Details', x, y);
    y += yIncrement;
    doc.setFontSize(10);

    // Draw Personal Details table
    y = drawDynamicTable(
      [
        ['First Name', 'Last Name', 'NIC Number', 'Phone Number', 'Address'],
        [
          formatValue(this.userObj.firstName),
          formatValue(this.userObj.lastName),
          formatValue(this.userObj.NICnumber),
          formatValue(this.userObj.phoneNumber),
          this.userObj.houseNo && this.userObj.streetName && this.userObj.city
            ? `${formatValue(this.userObj.houseNo)}, ${formatValue(this.userObj.streetName)}, ${formatValue(this.userObj.city)}`
            : '-'
        ]
      ],
      x,
      y,
      [25, 25, 30, 40, 60] // Column widths
    ) + yIncrement;

    // Add Bank Details section
    y += yIncrement*0.25;
    y += yIncrement;
    doc.setFontSize(12);
    doc.text('Bank Details', x, y);
    y += yIncrement;
    doc.setFontSize(10);

    // Draw Bank Details table
    y = drawDynamicTable(
      [
        ['Account Number', 'Account Holder\'s Name', 'Bank Name', 'Branch Name'],
        [
          formatValue(this.userObj.accNumber),
          formatValue(this.userObj.accHolderName),
          formatValue(this.userObj.bankName),
          formatValue(this.userObj.branchName)
        ]
      ],
      x,
      y,
      [40, 50, 30, 30] // Column widths
    ) + yIncrement;

    // Add Crop Details section
    y += yIncrement*0.25;
    y += yIncrement;
    doc.setFontSize(12);
    doc.text('Crop Details', x, y);
    y += yIncrement;
    doc.setFontSize(10);

    // Prepare crop details data for table
    const cropTableHeaders = ['Crop Name', 'Variety', 'Unit Price (A)', 'Quantity', 
                            'Unit Price (B)', 'Quantity', 'Unit Price (C)', 'Quantity', 'Total (Rs.)'];
    
    const cropTableData = this.CropArr.map(crop => [
      formatValue(crop.cropNameEnglish),
      formatValue(crop.varietyNameEnglish),
      formatValueForAmounts(crop.gradeAprice),
      formatValueForAmounts(crop.gradeAquan),
      formatValueForAmounts(crop.gradeBprice),
      formatValueForAmounts(crop.gradeBquan),
      formatValueForAmounts(crop.gradeCprice),
      formatValueForAmounts(crop.gradeCquan),
      formatValueForAmounts(this.calculateRowTotalforReport(crop).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    ]);

    // Draw Crop Details table with dynamic row heights
    y = drawDynamicTable(
      [cropTableHeaders, ...cropTableData],
      x,
      y,
      [25, 40, 20, 15, 20, 15, 20, 15, 20], // Column widths
      5, // Line height
      2 // Padding
    ) + yIncrement;

    // Add Full Total
    y += yIncrement
    doc.text('Full Total(Rs.) : '  + formatValueForAmounts(this.calculateOverallTotalforReport().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })) , x, y);
    y += yIncrement * 2.5;

    // QR Code Image Loading Function
    const loadImageAsBase64 = (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          const reader = new FileReader();
          reader.onloadend = function() {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = function() {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          };
          img.onerror = function() {
            resolve('');
          };
          img.src = url;
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.setRequestHeader('Accept', 'image/png;image/*');
        xhr.send();
      });
    };

    const appendCacheBuster = (url: string) => {
      if (!url) return '';
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}t=${new Date().getTime()}`;
    };

    // Load QR codes
    let farmerQrImagebase64 = '';
    let officerQrImagebase64 = '';
    
    try {
      if (this.userObj.farmerQr) {
        farmerQrImagebase64 = await loadImageAsBase64(appendCacheBuster(this.userObj.farmerQr));
      }
    } catch (error) {
      console.error('Error loading farmer QR:', error);
    }

    try {
      if (this.userObj.officerQr) {
        officerQrImagebase64 = await loadImageAsBase64(appendCacheBuster(this.userObj.officerQr));
      }
    } catch (error) {
      console.error('Error loading officer QR:', error);
    }

    // QR code positions
    const qrWidth = 40;
    const qrHeight = 40;
    const qrY = y;
    const farmerQrX = x;
    const officerQrX = x + qrWidth + 6;
    const labelY = qrY + qrHeight + 3;

    // Add farmer QR code
    if (farmerQrImagebase64) {
      doc.addImage(farmerQrImagebase64, 'PNG', farmerQrX, qrY, qrWidth, qrHeight);
    } else {
      doc.rect(farmerQrX, qrY, qrWidth - 5, qrHeight - 5);
      doc.setFontSize(10);
      doc.text('Not', farmerQrX + 14, qrY + 18);
      doc.text('Available', farmerQrX + 10, qrY + 23);
    }
    doc.setFontSize(12);
    doc.text('Farmer Qr Code', farmerQrX + 6, labelY);

    // Add officer QR code
    if (officerQrImagebase64) {
      doc.addImage(officerQrImagebase64, 'PNG', officerQrX, qrY, qrWidth, qrHeight);
    } else {
      doc.rect(officerQrX, qrY, qrWidth - 5, qrHeight - 5);
      doc.setFontSize(10);
      doc.text('Not', officerQrX + 14, qrY + 18);
      doc.text('Available', officerQrX + 10, qrY + 23);
    }
    doc.setFontSize(12);
    doc.text('Officer Qr Code', officerQrX + 6, labelY);

    // Save the PDF
    doc.save('invoice.pdf');
    this.isLoading = false;
}

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
    this.isLoading = false
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

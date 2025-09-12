import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportServiceService } from '../../../services/Report-service/report-service.service';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { jsPDF } from 'jspdf';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import html2canvas from 'html2canvas';
import { ThemeService } from '../../../theme.service';

@Component({
  selector: 'app-collection-daily-report',
  standalone: true,
  imports: [CommonModule, FormsModule, CanvasJSAngularChartsModule, LoadingSpinnerComponent],
  templateUrl: './collection-daily-report.component.html',
  styleUrl: './collection-daily-report.component.css',
  providers: [DatePipe]
})
export class CollectionDailyReportComponent implements OnInit {
  dailyReportArr: DailyReport[] = [];
  officerId!: number;
  officerName!: string;
  empId!: string;

  selectDate: string = '';
  loadingChart = true;
  loadingTable = true;
  chartOptions: any;
  hasData: boolean = true;
  isDarkTheam: boolean = false;

  isLoading: boolean = true;

  constructor(
    private router: Router,
    private ReportSrv: ReportServiceService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private themeService: ThemeService,

  ) { 
    this.isDarkTheam = this.themeService.getActiveTheme() === 'dark' ? true : false;
  }

  ngOnInit(): void {
    this.officerId = this.route.snapshot.params['id'];
    this.officerName = this.route.snapshot.params['name'];
    this.empId = this.route.snapshot.params['empid'];

    const today = new Date();
    this.selectDate = today.toISOString().split('T')[0];
    // this.isDarkTheam = localStorage.getItem('selectedTheme') === 'dark' ? true : false;

    this.fetchDailyReport();
  }

  fetchDailyReport(date: string = this.selectDate) {
    this.loadingTable = true;
    this.loadingChart = true;
    this.isLoading = true;

    this.ReportSrv.getCollectionDailyReport(this.officerId, date).subscribe(
      (res) => {
        console.log('response', res.data);

        this.hasData = res.data.length > 0;

        if (!this.hasData) {
          this.updateChart(); // Optional: clear chart when no data
        }

        // Always map the array (even if empty — safe)
        this.dailyReportArr = res.data.map((item: any) => ({
          ...item,
          gradeA: Number(item.gradeA) || 0,
          gradeB: Number(item.gradeB) || 0,
          gradeC: Number(item.gradeC) || 0,
          total: Number(item.total) || 0,
        }));

        console.log('array', this.dailyReportArr);

        this.updateChart();
        this.loadingTable = false;
        this.isLoading = false;
      },
      (err) => {
        console.error("Error fetching daily report:", err);
        this.loadingTable = false;
        this.loadingChart = false;
        this.isLoading = false;
      }
    );
  }


  navigateToReports() {
    this.router.navigate(['/reports']); // Change '/reports' to your desired route
  }

  filterByDate() {
    this.dailyReportArr = [];
    this.fetchDailyReport(this.selectDate);
  }

  updateChart() {
    this.isLoading = true;
    const gradeAData = this.dailyReportArr.map((crop) => ({
      label: crop.varietyNameEnglish,
      y: crop.gradeA || 0,
      color: "#2B88D9",
    }));

    console.log(gradeAData);

    const gradeBData = this.dailyReportArr.map((crop) => ({
      label: crop.varietyNameEnglish,
      y: crop.gradeB || 0,
      color: "#79BAF2",
    }));

    const gradeCData = this.dailyReportArr.map((crop) => ({
      label: crop.varietyNameEnglish,
      y: crop.gradeC || 0,
      color: "#A7D5F2",
    }));

    // Set colors based on theme
    const backgroundColor = this.isDarkTheam ? "#1F2937" : "#FFFFFF";
    const textColor = this.isDarkTheam ? "#FFFFFF" : "#000000";
    const gridColor = this.isDarkTheam ? "#374151" : "#E5E7EB";

    this.chartOptions = {
      animationEnabled: true,
      theme: this.isDarkTheam ? "dark2" : "light2", // Use appropriate theme
      backgroundColor: backgroundColor, // Set background color
      axisX: {
        title: "Crop Variety",
        titleFontColor: textColor,
        labelFontColor: textColor,
        lineColor: gridColor,
        tickColor: gridColor,
        reversed: true,
      },
      axisY: {
        title: "kg",
        titleFontColor: textColor,
        labelFontColor: textColor,
        lineColor: gridColor,
        tickColor: gridColor,
        gridColor: gridColor,
        includeZero: true,
      },
      legend: {
        cursor: "pointer",
        fontColor: textColor, // Legend text color
        itemclick: (e: any) => {
          e.dataSeries.visible = typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible;
          e.chart.render();
        },
      },
      toolTip: {
        shared: true,
        backgroundColor: this.isDarkTheam ? "#374151" : "#FFFFFF",
        fontColor: textColor,
        borderColor: gridColor
      },
      data: [
        {
          type: "stackedBar",
          name: "Grade A",
          showInLegend: true,
          legendMarkerColor: "#2B88D9",
          dataPoints: gradeAData,
          cursor: "pointer",
        },
        {
          type: "stackedBar",
          name: "Grade B",
          showInLegend: true,
          legendMarkerColor: "#79BAF2",
          dataPoints: gradeBData,
          cursor: "pointer",
        },
        {
          type: "stackedBar",
          name: "Grade C",
          showInLegend: true,
          legendMarkerColor: "#A7D5F2",
          dataPoints: gradeCData,
          cursor: "pointer",
        },
      ]
    };

    this.loadingChart = false;
    this.isLoading = false;
  }

  async downloadPdf() {
    const doc = new jsPDF();

    // Add title and header information;
    doc.setFontSize(14);
    doc.text(`${this.officerName} - ${this.empId}`, 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(64, 64, 64); // Dark gray
    doc.text(`On ${this.selectDate}`, 14, 30);

    // Capture the chart as an image with reduced size
    try {
      const chartElement = document.querySelector('canvasjs-chart') as HTMLElement;
      if (chartElement) {
        // Reduce the scale to make the captured image smaller
        const scale = 0.7; // Adjust this value (0.5-1.0) to change size

        const canvas = await html2canvas(chartElement, {
          scale: scale,
          logging: false,
          useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');

        // Set reduced dimensions for the PDF image
        const pdfImageWidth = 150; // mm (reduced from 180)
        const imgHeight = canvas.height * pdfImageWidth / canvas.width;

        // Add chart image to PDF
        doc.addImage(imgData, 'PNG', 15, 40, pdfImageWidth, imgHeight);

        // Start table after the chart with some margin
        const startY = 40 + imgHeight + 10;
        this.addTableToPdf(doc, startY);
      }
    } catch (error) {
      console.error('Error capturing chart:', error);
      // Fallback to table only if chart capture fails
      this.addTableToPdf(doc, 40);
    }

    doc.save(`Daily_Report_${this.officerName}_${this.selectDate}.pdf`);
  }

  // Helper method to add table to PDF
  private addTableToPdf(doc: jsPDF, startY: number) {
    doc.setFontSize(10);

    const headers = ['Variety Name', 'Grade A', 'Grade B', 'Grade C', 'Total'];
    const rowHeight = 10;
    const columnWidths = [60, 30, 30, 30, 30];

    let currentX = 14;

    headers.forEach((header, index) => {
      doc.setFillColor(228, 220, 211); // Background color (#E4DCD3)
      doc.setDrawColor(0); // Optional: black border
      doc.rect(currentX, startY, columnWidths[index], rowHeight, 'FD'); // Fill + border
      doc.setTextColor(0, 0, 0); // Text color
      doc.text(header, currentX + 2, startY + 7);
      currentX += columnWidths[index];
    });

    let currentY = startY + rowHeight;

    this.dailyReportArr.forEach((report) => {
      currentX = 14;
      const rowData = [
        report.varietyNameEnglish,
        report.gradeA.toFixed(2) + ' kg',
        report.gradeB.toFixed(2) + ' kg',
        report.gradeC.toFixed(2) + ' kg',
        report.total.toFixed(2) + ' kg',
      ];

      rowData.forEach((data, index) => {
        doc.rect(currentX, currentY, columnWidths[index], rowHeight); // Border only
        doc.text(data, currentX + 2, currentY + 7);
        currentX += columnWidths[index];
      });

      currentY += rowHeight;
    });
  }



}

class DailyReport {
  id!: number;
  varietyNameEnglish!: string;
  gradeA!: number;
  gradeB!: number;
  gradeC!: number;
  total!: number;
}

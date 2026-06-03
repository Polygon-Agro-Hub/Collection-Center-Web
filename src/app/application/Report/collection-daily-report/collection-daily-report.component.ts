import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportServiceService } from '../../../services/Report-service/report-service.service';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { jsPDF } from 'jspdf';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { ThemeService } from '../../../theme.service';
import { CustomDatepickerComponent } from '../../../components/custom-datepicker/custom-datepicker.component';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-collection-daily-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CanvasJSAngularChartsModule,
    LoadingSpinnerComponent,
    CustomDatepickerComponent,
  ],
  templateUrl: './collection-daily-report.component.html',
  styleUrl: './collection-daily-report.component.css',
  providers: [DatePipe],
})
export class CollectionDailyReportComponent implements OnInit {
  @ViewChild(CustomDatepickerComponent) datePicker!: CustomDatepickerComponent;
  dailyReportArr: DailyReport[] = [];
  officerId!: number;
  officerName!: string;
  empId!: string;

  selectDate: string | Date | null = null;
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
    private toastSrv: ToastAlertService
  ) {
    this.isDarkTheam =
      this.themeService.getActiveTheme() === 'dark' ? true : false;
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

  fetchDailyReport(date: string | Date | null = this.selectDate) {
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
        console.error('Error fetching daily report:', err);
        this.loadingTable = false;
        this.loadingChart = false;
        this.isLoading = false;
      },
    );
  }

  navigateToReports() {
    this.router.navigate(['/reports']); // Change '/reports' to your desired route
  }

  // filterByDate() {
  //   this.dailyReportArr = [];
  //   this.fetchDailyReport(this.selectDate);
  // }

  onDateChange(newDate: string | Date | null) {
  this.dailyReportArr = [];

  if (!newDate) {
    const today = new Date().toISOString().split('T')[0];
    this.selectDate = today;

    // ✅ Also reset the datepicker UI to show today's date
    if (this.datePicker) {
      this.datePicker.selectedDate = today;
    }
  } else {
    this.selectDate = newDate;
  }

  this.fetchDailyReport();
}

  updateChart() {
    this.isLoading = true;
    const gradeAData = this.dailyReportArr.map((crop) => ({
      label: crop.varietyNameEnglish,
      y: crop.gradeA || 0,
      color: '#2B88D9',
    }));

    console.log(gradeAData);

    const gradeBData = this.dailyReportArr.map((crop) => ({
      label: crop.varietyNameEnglish,
      y: crop.gradeB || 0,
      color: '#79BAF2',
    }));

    const gradeCData = this.dailyReportArr.map((crop) => ({
      label: crop.varietyNameEnglish,
      y: crop.gradeC || 0,
      color: '#A7D5F2',
    }));

    // Set colors based on theme
    const backgroundColor = this.isDarkTheam ? '#1F2937' : '#FFFFFF';
    const textColor = this.isDarkTheam ? '#FFFFFF' : '#000000';
    const gridColor = this.isDarkTheam ? '#374151' : '#E5E7EB';

    this.chartOptions = {
      animationEnabled: true,
      theme: this.isDarkTheam ? 'dark2' : 'light2', // Use appropriate theme
      backgroundColor: backgroundColor, // Set background color
      axisX: {
        title: 'Crop Variety',
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
    margin: 15,   // <-- adds space between axisY and the data/legend area
},
      legend: {
        cursor: 'pointer',
        fontColor: textColor,
        markerMargin: 10, // space between marker and label
        verticalAlign: 'bottom', // move legend below the chart
        horizontalAlign: 'center',
        margin: 20, // space around the legend block
        itemclick: (e: any) => {
          e.dataSeries.visible =
            typeof e.dataSeries.visible === 'undefined' || e.dataSeries.visible;
          e.chart.render();
        },
      },
      toolTip: {
        shared: true,
        backgroundColor: this.isDarkTheam ? '#374151' : '#FFFFFF',
        fontColor: textColor,
        borderColor: gridColor,
      },
      data: [
        {
          type: 'stackedBar',
          name: 'Grade A',
          showInLegend: true,
          legendMarkerColor: '#2B88D9',
          dataPoints: gradeAData,
          cursor: 'pointer',
        },
        {
          type: 'stackedBar',
          name: 'Grade B',
          showInLegend: true,
          legendMarkerColor: '#79BAF2',
          dataPoints: gradeBData,
          cursor: 'pointer',
        },
        {
          type: 'stackedBar',
          name: 'Grade C',
          showInLegend: true,
          legendMarkerColor: '#A7D5F2',
          dataPoints: gradeCData,
          cursor: 'pointer',
        },
      ],
    };

    this.loadingChart = false;
    this.isLoading = false;
  }

  downloadPdf() {
    const doc = new jsPDF();
    const margin = 14;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`${this.officerName} - ${this.empId}`, margin, 20);
    doc.setFontSize(11);
    doc.setTextColor(64, 64, 64);
    doc.text(`On ${this.selectDate}`, margin, 30);

    const chartEndY = this.drawBarChart(doc, margin, 38, contentWidth);

    let tableY = chartEndY + 8;
    if (tableY + this.dailyReportArr.length * 10 + 20 > pageHeight - 10) {
      doc.addPage();
      tableY = 15;
    }

    this.addTableToPdf(doc, tableY);
    doc.save(`Daily_Report_${this.officerName}_${this.selectDate}.pdf`);
    this.toastSrv.success('File Downloaded Successfully');
  }

  private drawBarChart(doc: jsPDF, x: number, y: number, width: number): number {
    const items = this.dailyReportArr;
    if (items.length === 0) return y;

    const labelColW = 44;
    const valueColW = 22;
    const barAreaX = x + labelColW;
    const barAreaW = width - labelColW - valueColW;
    const barH = 9;
    const rowH = barH + 5;

    const maxTotal = Math.max(...items.map(i => i.gradeA + i.gradeB + i.gradeC), 1);
    const scaledMax = maxTotal * 1.1;

    const dataStartY = y + 2;
    const gridSteps = 5;
    const gridBottom = dataStartY + items.length * rowH;

    // Grid lines
    doc.setLineWidth(0.1);
    doc.setDrawColor(200, 200, 200);
    for (let i = 1; i <= gridSteps; i++) {
      const gx = barAreaX + (i / gridSteps) * barAreaW;
      doc.line(gx, dataStartY, gx, gridBottom);
    }

    // Bars
    items.forEach((item, idx) => {
      const by = dataStartY + idx * rowH;

      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50);
      const label = item.varietyNameEnglish.length > 17
        ? item.varietyNameEnglish.substring(0, 15) + '..'
        : item.varietyNameEnglish;
      doc.text(label, barAreaX - 2, by + barH / 2 + 2.5, { align: 'right' });

      const aW = (item.gradeA / scaledMax) * barAreaW;
      if (aW > 0) {
        doc.setFillColor(43, 136, 217);
        doc.rect(barAreaX, by, aW, barH, 'F');
      }

      const bW = (item.gradeB / scaledMax) * barAreaW;
      if (bW > 0) {
        doc.setFillColor(121, 186, 242);
        doc.rect(barAreaX + aW, by, bW, barH, 'F');
      }

      const cW = (item.gradeC / scaledMax) * barAreaW;
      if (cW > 0) {
        doc.setFillColor(167, 213, 242);
        doc.rect(barAreaX + aW + bW, by, cW, barH, 'F');
      }

      doc.setFontSize(7);
      doc.setTextColor(80, 80, 80);
      doc.text(`${item.total.toFixed(1)}kg`, barAreaX + aW + bW + cW + 2, by + barH / 2 + 2);
    });

    // Axes
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.4);
    doc.line(barAreaX, dataStartY, barAreaX, gridBottom);
    doc.line(barAreaX, gridBottom, barAreaX + barAreaW, gridBottom);

    // X-axis tick labels
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    for (let i = 0; i <= gridSteps; i++) {
      const val = (scaledMax * i) / gridSteps;
      const gx = barAreaX + (i / gridSteps) * barAreaW;
      doc.text(`${val.toFixed(0)}`, gx, gridBottom + 5, { align: 'center' });
    }

    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text('Weight (kg)', barAreaX + barAreaW / 2, gridBottom + 11, { align: 'center' });

    // Legend
    const legendY = gridBottom + 20;
    const legendSpacing = 45;
    const legendEntries = [
      { label: 'Grade A', r: 43, g: 136, b: 217 },
      { label: 'Grade B', r: 121, g: 186, b: 242 },
      { label: 'Grade C', r: 167, g: 213, b: 242 },
    ];
    let lx = x + (width - legendEntries.length * legendSpacing) / 2;
    legendEntries.forEach(entry => {
      doc.setFillColor(entry.r, entry.g, entry.b);
      doc.rect(lx, legendY - 4, 7, 5, 'F');
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50);
      doc.text(entry.label, lx + 9, legendY);
      lx += legendSpacing;
    });

    return legendY + 8;
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

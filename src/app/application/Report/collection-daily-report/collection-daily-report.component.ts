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
  isDownloading: boolean = false;

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

  downloadPDF() {
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

  // ── Y-axis main label (rotated 90°, centered vertically over chart rows) ──
  const chartCenterY = dataStartY + (items.length * rowH) / 2;
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text('Variety Name', x + 4, chartCenterY, {
    angle: 90,
    align: 'center',
  });

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

  async downloadPDF2(): Promise<void> {
    // console.log('created date', this.createdDateForPdf);
    this.isDownloading = true;
    setTimeout(() => {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
  
      const colors = {
        gradeA: '#FF9263',
        gradeB: '#5F75E9',
        gradeC: '#3DE188',
      };
  
      // ── Header ────────────────────────────────────────────────────
      doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`${this.officerName} - ${this.empId}`, 24, 14);
    doc.setFontSize(11);
    doc.setTextColor(64, 64, 64);
    doc.text(`On ${this.selectDate}`, 24, 24);
  
      if (Object.keys(this.dailyReportArr).length === 0) {
        doc.setFontSize(10);
        doc.text('No data available to display.', 30, 35);
        doc.save(`Daily_Report_${this.officerName}_${this.selectDate}.pdf`);
        this.isDownloading = false;
        return;
      }
  
      const groupedData = this.dailyReportArr.map(item => ({
  cropName: item.varietyNameEnglish,
  gradeA: item.gradeA || 0,
  gradeB: item.gradeB || 0,
  gradeC: item.gradeC || 0,
  totalWeight: item.total || 0,
}));
      console.log('groupedData', groupedData)
  
      const legendItems = [
        { label: 'Grade A', color: colors.gradeA },
        { label: 'Grade B', color: colors.gradeB },
        { label: 'Grade C', color: colors.gradeC },
      ];
      const legendBoxSize = 4;
      const legendItemWidth = 30;
      const legendStartX = pageWidth / 2 - (legendItems.length * legendItemWidth) / 2;
  
      // ── Draw legend first ─────────────────────────────────────────
      const legendY = 32;
      legendItems.forEach((item, i) => {
        const lx = legendStartX + i * legendItemWidth;
        const [r, g, b] = this.hexToRgb(item.color);
        doc.setFillColor(r, g, b);
        doc.rect(lx, legendY, legendBoxSize, legendBoxSize, 'F');
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.text(item.label, lx + legendBoxSize + 2, legendY + legendBoxSize - 1);
      });
  
      const labelAreaWidth = 38;
      const chartStartX = 15 + labelAreaWidth;
      const barHeight = 9;
      const rowGap = 14;
      const chartWidth = 120;
  
      const maxWeight = Math.max(...groupedData.map((c) => c.totalWeight));
  
      // ✅ FIX 1: chartStartY dynamically derived from legendY so they never overlap
      const chartStartY = legendY + legendBoxSize + 8;
  
      // ✅ FIX 2: Y-axis title is centred within the label column and tracks chart midpoint
      const totalChartHeight = groupedData.length * rowGap;
      const chartMidY = chartStartY + totalChartHeight / 2;
      const yAxisTitleX = 15 + labelAreaWidth / 2;  // horizontal centre of the label column
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text('Crop Variety', yAxisTitleX, chartMidY, { angle: 90, align: 'center' });
  
      groupedData.forEach((crop, rowIndex) => {
        const rowY = chartStartY + rowIndex * rowGap;
        const barMidY = rowY + barHeight / 2;
  
        const maxChars = 14;
        let labelLines: string[];
        if (crop.cropName.length <= maxChars) {
          labelLines = [crop.cropName];
        } else {
          const spaceIdx = crop.cropName.lastIndexOf(' ', maxChars);
          if (spaceIdx > 0) {
            labelLines = [
              crop.cropName.substring(0, spaceIdx),
              crop.cropName.substring(spaceIdx + 1),
            ];
          } else {
            labelLines = [
              crop.cropName.substring(0, maxChars),
              crop.cropName.substring(maxChars),
            ];
          }
        }
  
        // Draw label lines centred on bar
        doc.setFontSize(7.5);
        doc.setTextColor(0, 0, 0);
        const lineHeight = 3.5;
        const labelBaseY =
          labelLines.length === 1
            ? barMidY + 1
            : barMidY - lineHeight / 2 + 1;
  
        labelLines.forEach((line, li) => {
          doc.text(line, chartStartX - 2, labelBaseY + li * lineHeight, { align: 'right' });
        });
  
        // Draw stacked bars
        let currentX = chartStartX;
        const gradeKeys = [
          { key: 'gradeA', color: colors.gradeA },
          { key: 'gradeB', color: colors.gradeB },
          { key: 'gradeC', color: colors.gradeC },
        ];
  
        gradeKeys.forEach(({ key, color }) => {
          const weight = crop[key as keyof typeof crop] as number;
          if (weight > 0) {
            const barWidth = (weight / maxWeight) * chartWidth;
            const [r, g, b] = this.hexToRgb(color);
            doc.setFillColor(r, g, b);
            doc.rect(currentX, rowY, barWidth, barHeight, 'F');
  
            // Label inside bar (only if wide enough)
            if (barWidth > 12) {
              doc.setFontSize(6.5);
              doc.setTextColor(255, 255, 255);
              doc.text(
                `${weight}kg`,
                currentX + barWidth / 2,
                rowY + barHeight / 2 + 2,
                { align: 'center' }
              );
            }
            currentX += barWidth;
          }
        });
      });
  
      // ── Axes ──────────────────────────────────────────────────────
      const axisY = chartStartY + groupedData.length * rowGap + 2;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.4);
      doc.line(chartStartX, chartStartY, chartStartX, axisY);
      doc.line(chartStartX, axisY, chartStartX + chartWidth, axisY);
  
      // X-axis tick labels
      const tickCount = 5;
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 80);
      for (let t = 0; t <= tickCount; t++) {
        const tickX = chartStartX + (t / tickCount) * chartWidth;
        const tickValue = Math.round((t / tickCount) * maxWeight);
        doc.line(tickX, axisY, tickX, axisY + 1.5);
        doc.text(`${tickValue}`, tickX, axisY + 5, { align: 'center' });
      }
  
      // X-axis title
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text('Total Weight (kg)', chartStartX + chartWidth / 2, axisY + 10, { align: 'center' });
  
      // ── Table ─────────────────────────────────────────────────────
      const tableStartY = axisY + 18;
      const cellHeight = 8;
      const cellPadding = 2;
      const tableColWidths = [50, 30, 30, 30, 30];
  
      // Centre the table horizontally
      const totalTableWidth = tableColWidths.reduce((a, b) => a + b, 0); // 170
      const startX = (pageWidth - totalTableWidth) / 2;
  
      let rowY = tableStartY;
  
      const headers = ['Crop Variety', 'Grade A', 'Grade B', 'Grade C', 'Total'];
  
      doc.setLineWidth(0.2);
      doc.setDrawColor(180, 180, 180);
  
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      headers.forEach((header, index) => {
        const cellX = startX + tableColWidths.slice(0, index).reduce((a, b) => a + b, 0);
        doc.rect(cellX, rowY, tableColWidths[index], cellHeight);
        doc.text(header, cellX + cellPadding, rowY + cellHeight / 2 + 2.5);
      });
      rowY += cellHeight;
  
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(90, 90, 90);
      groupedData.forEach((crop) => {
        const cropValues = [
          crop.cropName,
          crop.gradeA ? `${crop.gradeA} kg` : '-',
          crop.gradeB ? `${crop.gradeB} kg` : '-',
          crop.gradeC ? `${crop.gradeC} kg` : '-',
          `${crop.totalWeight} kg`,
        ];
        cropValues.forEach((value, index) => {
          const cellX = startX + tableColWidths.slice(0, index).reduce((a, b) => a + b, 0);
          doc.rect(cellX, rowY, tableColWidths[index], cellHeight);
          doc.text(value, cellX + cellPadding, rowY + cellHeight / 2 + 2.5);
        });
        rowY += cellHeight;
      });
  
      doc.save(`Daily_Report_${this.officerName}_${this.selectDate}.pdf`);
      this.isDownloading = false;
    }, 0);
  }

hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
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

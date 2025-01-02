import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportServiceService } from '../../../services/Report-service/report-service.service';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-collection-daily-report',
  standalone: true,
  imports: [CommonModule, FormsModule, CanvasJSAngularChartsModule],
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

  constructor(
    private router: Router,
    private ReportSrv: ReportServiceService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.officerId = this.route.snapshot.params['id'];
    this.officerName = this.route.snapshot.params['name'];
    this.empId = this.route.snapshot.params['empid'];
    
    const today = new Date();
    this.selectDate = today.toISOString().split('T')[0]; 
    
    this.fetchDailyReport();
  }

  fetchDailyReport(date: string = this.selectDate) {
    this.loadingTable = true;
    this.loadingChart = true;
    this.ReportSrv.getCollectionDailyReport(this.officerId, date).subscribe(
      (res) => {
        this.dailyReportArr = res.map((item: any) => ({
          ...item,
          gradeA: Number(item.gradeA) || 0,
          gradeB: Number(item.gradeB) || 0,
          gradeC: Number(item.gradeC) || 0,
        }));
        this.updateChart();
        this.loadingTable = false;
      },
      (err) => {
        console.error("Error fetching daily report:", err);
        this.loadingTable = false;
        this.loadingChart = false;
      }
    );
  }

  filterByDate() {
    this.dailyReportArr = [];
    this.fetchDailyReport(this.selectDate);
  }

  updateChart() {
    const gradeAData = this.dailyReportArr.map((crop) => ({
      label: crop.varietyNameEnglish,
      y: crop.gradeA || 0,
      color: "#2B88D9",
    }));

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

    this.chartOptions = {
      animationEnabled: true,
      theme: "light2",
      axisX: {
        title: "Crops",
        reversed: true,
      },
      axisY: {
        title: "Total Weight (Kg)",
        includeZero: true,
      },
      legend: {
        cursor: "pointer",
        itemclick: (e: any) => {
          e.dataSeries.visible = typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible;
          e.chart.render();
        },
      },
      data: [
        {
          type: "stackedBar",
          name: "Grade A",
          showInLegend: true,
          legendMarkerColor: "#2B88D9", 
          dataPoints: gradeAData,
        },
        {
          type: "stackedBar",
          name: "Grade B",
          showInLegend: true,
          legendMarkerColor: "#79BAF2", 
          dataPoints: gradeBData,
        },
        {
          type: "stackedBar",
          name: "Grade C",
          showInLegend: true,
          legendMarkerColor: "#A7D5F2", 
          dataPoints: gradeCData,
        },
      ],
    };

    this.loadingChart = false;
  }

  downloadPdf() {
    const doc = new jsPDF();
  
    const title = `Daily Report`;
    doc.setFontSize(18);
    doc.text(title, 14, 10);
  
    const title2 = `${this.officerName} - ${this.empId}`;
    doc.setFontSize(14);
    doc.text(title2, 14, 20);
  
    const dateText = `On ${this.selectDate}`;
    doc.setFontSize(12);
    doc.text(dateText, 14, 30);
  
    const startY = 40; 
    doc.setFontSize(10);
    const headers = ['Variety Name', 'Grade A', 'Grade B', 'Grade C', 'Total'];
  
    const rowHeight = 10;
    const columnWidths = [60, 30, 30, 30, 30]; 
  
    let currentX = 14;
    headers.forEach((header, index) => {
      doc.rect(currentX, startY, columnWidths[index], rowHeight);
      doc.text(header, currentX + 2, startY + 7); 
      currentX += columnWidths[index];
    });
  
    let currentY = startY + rowHeight;
    this.dailyReportArr.forEach((report) => {
      currentX = 14;
      const rowData = [
        report.varietyNameEnglish,
        report.gradeA.toString() + 'Kg',
        report.gradeB.toString() + 'Kg',
        report.gradeC.toString() + 'Kg',
        report.total.toString() + 'Kg',
      ];
  
      rowData.forEach((data, index) => {
        doc.rect(currentX, currentY, columnWidths[index], rowHeight);
        doc.text(data, currentX + 2, currentY + 7);
        currentX += columnWidths[index];
      });
  
      currentY += rowHeight;
    });
  
    doc.save(`Daily_Report_${this.officerName}_${this.selectDate}.pdf`);
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

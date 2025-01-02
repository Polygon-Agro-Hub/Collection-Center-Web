import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportServiceService } from '../../../services/Report-service/report-service.service';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

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
    this.dailyReportArr=[];
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

  downloadPdf(){
    
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

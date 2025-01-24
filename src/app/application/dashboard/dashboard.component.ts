import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DashboardService } from '../../services/Dashbord-service/dashbord.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatePipe],
})
export class DashboardComponent implements OnInit, AfterViewInit {

  COOCount: number = 0;
  CUOCount: number = 0;
  totals: Total[] = [];
  activityLogs!: ActiveData[]; 
  chart: any;

  constructor(
    private dashboardService: DashboardService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.fetchOfficerCounts();
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  fetchOfficerCounts(): void {
    this.dashboardService.getOfficerCounts().subscribe(
      (data) => {
        this.COOCount = data.COOCount.COOCount;
        this.CUOCount = data.CUOCount.CUOCount;
        this.activityLogs = data.activities.map((log: any) => {
          log.updateAt = this.formatDate(log.updateAt);
          return log;
        });
      },
      (error) => {
        console.error('Error fetching officer counts', error);
      }
    );
  }

  formatDate(dateString: string, format: string = 'yyyy-MM-dd h:mm a'): string {
    const formattedDate = this.datePipe.transform(dateString, format);
    return formattedDate ? formattedDate : 'Unknown time';
  }

  fetchChart(range: string): void {
    this.dashboardService.getChartData(range).subscribe(
      (data) => {
        this.totals = data.map((item: any) => ({
          date: this.formatDate(item.date),
          totCount: item.totCount,
        }));
        this.updateChart();
      },
      (error) => {
        console.error('Error fetching chart data', error);
      }
    );
  }

  getDayOfWeek(date: string): string {
    const dayOfWeek = new Date(date).getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  }

  createChart() {
    const canvas = document.getElementById('MyChart') as HTMLCanvasElement;

    if (canvas) {
      this.chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "Sales",
              data: [4000, 3000, 2000, 5000, 6000, 8000, 7000, 5000, 4000, 3000, 2000, 1000],
              borderColor: "#4E97FD",
              backgroundColor: "rgba(78, 151, 253, 0.3)",
              fill: true,
              tension: 0.4
            },
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              labels: {
                color: 'white'
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: 'white'
              },
              grid: {
                display: false
              }
            },
            y: {
              ticks: {
                color: 'white'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          }
        }
      });
    } else {
      console.error('Canvas element not found');
    }
  }

  updateChart() {
    if (this.chart) {
      this.chart.data.labels = this.totals.map((item) => item.date);
      this.chart.data.datasets[0].data = this.totals.map((item) => item.totCount);
      this.chart.update();
    }
  }
}

class ActiveData {
  cropNameEnglish!: string;
  grade!: string;
  price!: string;
  updatedPrice!: string;
  varietyNameEnglish!: string;
  updateAt!: string;
}

class Total {
  date!: string;
  totCount!: number;
}

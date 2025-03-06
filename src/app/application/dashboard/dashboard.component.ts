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
  activeButton: string = 'week';

  constructor(
    private dashboardService: DashboardService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    // window.location.reload();
    this.fetchOfficerCounts();
    this.fetchChart('week')
  }

  ngAfterViewInit(): void {
    this.fetchChart('week');
  }

  fetchOfficerCounts(): void {
    this.dashboardService.getOfficerCounts().subscribe(
      (data) => {
        this.COOCount = data.COOCount.COOCount;
        this.CUOCount = data.CUOCount.CUOCount;
        this.activityLogs = data.activities.map((log: any) => {
          log.updateAt = this.formatDate(log.updateAt);  // Time only format
          return log;
        });
      },
      (error) => {
        console.error('Error fetching officer counts', error);
      }
    );
  }
  
  formatDate(dateString: string, format: string = 'h:mm a'): string {
    const formattedDate = this.datePipe.transform(dateString, format);
    return formattedDate ? formattedDate : 'Unknown time';
  }
  

  fetchChart(filter: string) {
    this.activeButton = filter;
    
    this.dashboardService.getChartData(filter).subscribe(
      (response: any) => {
        
        this.totals = response;

       
        const labels = this.totals.map(item => item.date);
        const data = this.totals.map(item => item.totCount);

        
        const canvas = document.getElementById('MyChart') as HTMLCanvasElement;

        if (canvas) {
         
          if (this.chart) {
            this.chart.destroy();
          }

          this.chart = new Chart(canvas, {
            type: 'line',
            data: {
              labels: labels, 
              datasets: [
                {
                  label: "",
                  data: data, 
                  borderColor: "#4E97FD",
                  backgroundColor: "#6F64A766",
                  fill: true,
                  tension: 0.4,

                },
              ]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    color: ''
                  }
                }
              },
              scales: {
                x: {
                  ticks: {
                    color: 'black'
                  },
                  grid: {
                    display: true,
                    color: '#060606',

                  }
                },
                y: {
                  ticks: {
                    color: 'black'           //#FFFFFF
                  },
                  grid: {
                    display: true,
                    color: '#060606'
                  }
                }
              }
            }
          });
        } else {
          console.error('Canvas element not found');
        }
      },
      (error) => {
        console.error('Error fetching chart data:', error);
      }
    );
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

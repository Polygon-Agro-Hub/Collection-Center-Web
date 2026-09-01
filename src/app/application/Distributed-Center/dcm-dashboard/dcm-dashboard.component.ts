import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, HostListener, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DistributionServiceService } from '../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import Swal from 'sweetalert2';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dcm-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './dcm-dashboard.component.html',
  styleUrl: './dcm-dashboard.component.css'
})
export class DcmDashboardComponent implements OnInit {
  isLoading: boolean = false;
  myChart: any;
  dioCount!: number;

  // Use 24-hour format labels for X-axis
  hours: string[] = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  chartData: number[] = [];

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  constructor(
    private router: Router,
    private ComplainSrv: ComplaintsService,
    private DistributionSrv: DistributionServiceService,
    private location: Location,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    this.isLoading = true;
    this.DistributionSrv.getDispatchChartData().subscribe({
      next: (data: any) => {
        this.dioCount = data.dioCount;
        this.processChartData(data.chartData);
        this.isLoading = false;

        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
          this.createChart();
        }, 100);
      },
      error: (error) => {
        console.error('Error loading chart data:', error);
        this.isLoading = false;
        // Create chart with empty data as fallback
        setTimeout(() => {
          this.createChart();
        }, 100);
      }
    });
  }

  processChartData(apiData: any[]): void {

    // Initialize array with zeros for all 24 hours
    this.chartData = new Array(24).fill(0);

    // Map the API data to our chart data array
    if (apiData && apiData.length > 0) {

      apiData.forEach(item => {
        const hour = item.hourSlot; // This should be 0-23 from the API
        const orderCount = item.orderCount;

        if (hour >= 0 && hour < 24) {
          this.chartData[hour] = orderCount;
        }
      });
    }


  }

  createChart(): void {
    const ctx = document.getElementById('MyChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('Chart canvas not found');
      return;
    }

    // Destroy existing chart if it exists
    if (this.myChart) {
      this.myChart.destroy();
    }

    this.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.hours,
        datasets: [{
          label: 'Orders Completed',
          data: this.chartData,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: 'rgba(158, 159, 214, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: false,
              text: 'Number of Orders',
              color: '#666',
              font: {
                size: 14,
                weight: 'bold',
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              color: '#666',
              font: {
                size: 12
              },
              precision: 0 // Ensure whole numbers
            }
          },
          x: {
            title: {
              display: false,
              text: 'Completion Time (Hours)',
              color: '#666',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              color: '#666',
              font: {
                size: 11
              },
              maxRotation: 90,
              minRotation: 90
            }
          }
        },
        plugins: {
          legend: {
            display: false,
            position: 'top',
            labels: {
              color: '#666',
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            callbacks: {
              title: (context) => {
                return `Time: ${context[0].label}`;
              },
              label: (context) => {
                return `Orders Completed: ${context.parsed.y}`;
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'nearest'
        }
      }
    });
  }

  refreshChart(): void {
    this.loadChartData();
  }

  // Clean up chart when component is destroyed
  ngOnDestroy(): void {
    if (this.myChart) {
      this.myChart.destroy();
    }
  }
}
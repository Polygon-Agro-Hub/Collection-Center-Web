import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/Dashbord-service/dashbord.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common'; // Import DatePipe

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatePipe] // Provide DatePipe in the component
})
export class DashboardComponent implements OnInit {
  COOCount: number = 0; // Collection Officer Count
  CUOCount: number = 0; // Customer Officer Count

  activityLogs!: ActiveData[];

  constructor(
    private dashboardService: DashboardService,
    private datePipe: DatePipe // Inject DatePipe
  ) { }

  ngOnInit(): void {
    this.fetchOfficerCounts();
  }

  fetchOfficerCounts(): void {
    this.dashboardService.getOfficerCounts().subscribe(
      (data) => {
        console.log(data);

        this.COOCount = data.COOCount.COOCount;
        this.CUOCount = data.CUOCount.CUOCount;
        this.activityLogs = data.activities.map((log: any) => {
          log.updateAt = this.formatDate(log.updateAt); // Format the date using DatePipe
          return log;
        });
      },
      (error) => {
        console.error('Error fetching officer counts', error);
      }
    );
  }

  // Use DatePipe to format the date
  formatDate(dateString: string): string {
    const formattedDate = this.datePipe.transform(dateString, 'h:mm a'); // Format as 11:58 PM
    return formattedDate ? `At ${formattedDate}` : 'Unknown time'; // Return formatted date
  }
}

class ActiveData {
  cropNameEnglish!: string;
  grade!: string;
  price!: string;
  updatedPrice!: string;
  varietyNameEnglish!: string;
  updateAt!: string; // This will store the formatted date
}

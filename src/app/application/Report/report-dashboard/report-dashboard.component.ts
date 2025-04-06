import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './report-dashboard.component.html',
  styleUrl: './report-dashboard.component.css'
})
export class ReportDashboardComponent {

  constructor(
    private router: Router
  ) {

  }
  isCollectionReportClicked: boolean = false;
  isOfficerReportClicked: boolean = false;

  onCollectionReportClick() {
    console.log('clicked')
    this.isCollectionReportClicked = true;
    this.isOfficerReportClicked = false;
    this.navigateToCollectionReport();
  }

  onOfficerReportClick() {
    this.isOfficerReportClicked = true;
    this.isCollectionReportClicked = false;
    this.navigateToOfficerReport();
  }

  navigateToCollectionReport() {
    if (this.isCollectionReportClicked) {
      console.log('collection repport, ', this.isCollectionReportClicked);
      this.router.navigate(['reports/collection-reports']);
    }
  }

  navigateToOfficerReport() {
    if (this.isOfficerReportClicked) {
      console.log('officer reports', this.isOfficerReportClicked);
      this.router.navigate(['reports/officer-reports']);
    }
  }
}

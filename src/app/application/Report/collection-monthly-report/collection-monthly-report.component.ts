import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportServiceService } from '../../../services/Report-service/report-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-collection-monthly-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './collection-monthly-report.component.html',
  styleUrl: './collection-monthly-report.component.css',
  providers: [DatePipe]

})
export class CollectionMonthlyReportComponent implements OnInit {
  officerDataObj: OfficerDetails = new OfficerDetails();
  farmerDataArr!: FarmerDetails[]
  officerId!: number;
  currentDate: Date = new Date();
  startDate: Date = new Date();
  endDate: Date = new Date();

  hasData: boolean = false;

  constructor(
    private router: Router,
    private ReportSrv: ReportServiceService,
    private route: ActivatedRoute,
    private datePipe: DatePipe

  ) { }

  ngOnInit(): void {
    this.officerId = this.route.snapshot.params['id'];
    setInterval(() => {
      this.currentDate = new Date();
    }, 5000);
  }

  fetchOfficerData() {
    this.ReportSrv.getCollectionmonthlyReportOfficerData(this.officerId,this.startDate,this.endDate).subscribe(
      (res) => {
        console.log(res);
        
        this.officerDataObj = res.officer;
        this.farmerDataArr = res.dates;

        if(res.dates.length > 0){
          this.hasData = true;
        }else{
          this.hasData = false;
        }

        
      },
      (err) => {
        this.hasData = false;
      }
    )
  }

  filterDate(){
    console.log(this.startDate,this.endDate);
    this.fetchOfficerData();
  }


startDateValidation() {
  const today = new Date();
  const selectedDate = new Date(this.startDate);

  if (selectedDate > today) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Date',
      text: 'Start date cannot be a future date.',
      confirmButtonText: 'OK',
    });

    this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }
}

endDateValidation() {
  const today = new Date();
  const selectedEndDate = new Date(this.endDate);

  if (!this.startDate) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Start Date',
      text: 'Please select a start date before selecting an end date.',
      confirmButtonText: 'OK',
    });

    this.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());;
    return;
  }

  if (selectedEndDate > today) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid End Date',
      text: 'End date cannot be a future date.',
      confirmButtonText: 'OK',
    });

    this.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());;
  }
}


  

}

class OfficerDetails {
  id!: number
  firstNameEnglish!: string
  lastNameEnglish!: string
  jobRole!: string
  empId!: string
  TotalQty!: string
  TotalFarmers!: string
}

class FarmerDetails {
  ReportDate!: string
  TotalQty!: string
  TotalFarmers!: string
}

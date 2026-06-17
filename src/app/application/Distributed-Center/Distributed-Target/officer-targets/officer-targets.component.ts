import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';
import { CustomDatepickerComponent } from '../../../../components/custom-datepicker/custom-datepicker.component';

@Component({
  selector: 'app-officer-targets',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent, CustomDatepickerComponent],
  templateUrl: './officer-targets.component.html',
  styleUrl: './officer-targets.component.css'
})
export class OfficerTargetsComponent implements OnInit {

  officersArr: Officers[] = [];
  hasData: boolean = true;
  totalItems!: number;
  selectedDate!: string;
  isLoading:boolean = true;

  constructor(
    private router: Router,
    private ComplainSrv: ComplaintsService,
    private DistributionSrv: DistributionServiceService
  ) { }

  ngOnInit(): void {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
    this.fetchofficerTargets();
  }

  fetchofficerTargets(date: string = this.selectedDate) {
    this.isLoading = true;
    this.DistributionSrv.getofficerTargets(date).subscribe(
      (res) => {
        this.officersArr = res.officers
        this.totalItems = res.officers.length | 0;
        if (res.officers.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;
        }
        this.isLoading = false;
      }
    )
  }

  viewSelectedOfficerTarget(officerId: number, date: string, empId: string) {
    this.router.navigate(['/officer-targets/view-officer-target', officerId, date], {
      queryParams: { empId },
    })
  }

  onDateChange(newDate: string | Date | null) {
    let dateString: string;
    if (!newDate) {
      dateString = new Date().toISOString().split('T')[0];
    } 
    else if (newDate instanceof Date) {
      dateString = newDate.toISOString().split('T')[0];
    } 
    else {
      dateString = newDate;
    }
    this.selectedDate = dateString;
    this.fetchofficerTargets();
  }
}

class Officers {
  officerId!: number
  total!: number
  pending!: number
  completed!: number
  opened!: number
  empId!: string
  name!: string

}

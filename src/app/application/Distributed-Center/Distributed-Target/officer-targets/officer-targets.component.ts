import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';

@Component({
  selector: 'app-officer-targets',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './officer-targets.component.html',
  styleUrl: './officer-targets.component.css'
})
export class OfficerTargetsComponent implements OnInit {

  officersArr: Officers[] = [];

  hasData: boolean = true;
  totalItems!: number;

  isLoading:boolean = true;

  
  constructor(
    private router: Router,
    private ComplainSrv: ComplaintsService,
    private DistributionSrv: DistributionServiceService
  ) { }


  ngOnInit(): void {
    this.fetchofficerTargets();
  }

  fetchofficerTargets() {
    this.isLoading = true;
    this.DistributionSrv.getofficerTargets().subscribe(
      (res) => {
        this.officersArr = res.officers
        console.log('officersArr', this.officersArr)
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

  viewSelectedOfficerTarget(officerId: number) {
    this.router.navigate(['/officer-targets/view-officer-target', officerId])
  }

  

}

class Officers {
  officerId!: number
  allOrders!: number
  pending!: number
  completed!: number
  opened!: number
  empId!: string
  firstNameEnglish!: string
  lastNameEnglish!: string
}

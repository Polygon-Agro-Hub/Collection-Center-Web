import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { Router } from '@angular/router';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import Swal from 'sweetalert2';
import { TokenServiceService } from '../../../services/Token/token-service.service';

@Component({
  selector: 'app-claim-officer',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './claim-officer.component.html',
  styleUrl: './claim-officer.component.css'
})
export class ClaimOfficerComponent implements OnInit {
  officerObj: OfficerDetails = new OfficerDetails();

  selectJobRole!: string
  inputId: string = '';
  isOfficerExist: boolean = false;
  hasData!: boolean

  isLoading:boolean = false;

  showClaimView = false;

  logingRole: string | null = null;


  constructor(
    private ManageOficerSrv: ManageOfficersService,
    private router: Router,
    private toastSrv: ToastAlertService,
    private tokenSrv: TokenServiceService
  ) {
    this.logingRole = tokenSrv.getUserDetails().role
   }

  ngOnInit(): void {
    this.selectJobRole = ''
  }

  fetchOfficer() {
    if (!this.inputId) {
      return this.toastSrv.warning('Pleace enter valid employee id!');
    }

    this.isLoading = true;
    let empId;
    if (this.selectJobRole === 'Customer Officer') {
      empId = 'CUO' + this.inputId
    } else if (this.selectJobRole === 'Collection Officer'){
      empId = 'COO' + this.inputId
    } else {
      empId = 'DIO' + this.inputId
    }

    this.ManageOficerSrv.getOfficerByEmpId(empId).subscribe(
      (res) => {
        if (res.status) {
          this.officerObj = res.data
          this.isOfficerExist = true
          this.hasData = false
          this.isLoading = false;
        } else {
          this.isOfficerExist = false;
          this.hasData = true
          this.isLoading = false;

        }
      }
    )
  }

  toggleClaimView() {
    this.showClaimView = !this.showClaimView; // Toggle the boolean value
  }

  

  cancelClaim() {
    this.showClaimView = false;
    this.router.navigate(['/distribution-officers']);
  }

  confirmClaim(id: number) {
    this.isLoading = true;
    this.ManageOficerSrv.claimOfficer(id).subscribe(
      (res) => {
        this.isLoading = false;
        if (res.status) {
          this.toastSrv.success(`${this.officerObj.firstNameEnglish} ${this.officerObj.lastNameEnglish} (EMP ID - "${this.officerObj.empId}") Claim Successful`);
          this.showClaimView = false;
          // Call fetchOfficer directly without navigation
          this.fetchOfficer();
        } else {
          this.toastSrv.error(`${this.officerObj.firstNameEnglish} ${this.officerObj.lastNameEnglish} (EMP ID - "${this.officerObj.empId}") Claim Unsuccessful!`);
        }
      },
      (error) => {
        this.isLoading = false;
        this.toastSrv.error("An error occurred while claiming the officer.");
      }
    );
  }
  
  
  

}

class OfficerDetails {
  id!: number
  firstNameEnglish!: string
  lastNameEnglish!: string
  jobRole!: string
  empId!: string
  companyNameEnglish!: string
  claimStatus!: number
  centerName!: string
  image!: string
  distributedCenterName!: string
}


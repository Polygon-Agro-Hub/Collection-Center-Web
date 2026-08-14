import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { Router } from '@angular/router';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import Swal from 'sweetalert2';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';

@Component({
  selector: 'app-claim-officer',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, SerchableDropdownComponent],
  templateUrl: './claim-officer.component.html',
  styleUrl: './claim-officer.component.css'
})
export class ClaimOfficerComponent implements OnInit {
  officerObj: OfficerDetails = new OfficerDetails();

  selectJobRole!: string
  inputId: string = '';
  isOfficerExist: boolean = false;
  hasData!: boolean
  isLoading: boolean = false;
  showClaimView = false;
  logingRole: string | null = null;
  isReset: boolean = false;

  jobRoleItems: { value: string; label: string }[] = []

  constructor(
    private ManageOficerSrv: ManageOfficersService,
    private router: Router,
    private toastSrv: ToastAlertService,
    private tokenSrv: TokenServiceService
  ) {
    this.logingRole = tokenSrv.getUserDetails().role
  }

  ngOnInit(): void {
    if (this.logingRole === 'Distribution Centre Manager') {
      // Distribution Centre Manager picks from an interactive dropdown, so leave it
      // unselected and force a deliberate choice.
      this.selectJobRole = '';
      this.jobRoleItems = [
        { value: 'Distribution Officer', label: 'Distribution Officer' },
        { value: 'Driver', label: 'Driver' }
      ];
    } else if (this.logingRole === 'Collection Centre Manager') {
      // Collection Centre Manager only sees a readonly field with no way to pick a value,
      // so it must be pre-selected here or the search can never be run.
      this.selectJobRole = 'Collection Officer';
    }
  }

  fetchOfficer() {
    if (!this.inputId) {
      return this.toastSrv.warning('Please fill in all fields');
    }

    this.inputId = this.inputId?.trim();
    this.isLoading = true;
    let empId;
    if (this.selectJobRole === 'Customer Officer') {
      empId = 'CUO' + this.inputId
    } else if (this.selectJobRole === 'Collection Officer') {
      empId = 'COO' + this.inputId
    } else if (this.selectJobRole === 'Distribution Officer') {
      empId = 'DIO' + this.inputId
    } else {
      empId = 'DRV' + this.inputId
    }

    this.ManageOficerSrv.getOfficerByEmpId(empId).subscribe(
      (res) => {
        if (res.status) {
          this.officerObj = res.data
          this.isOfficerExist = true
          this.hasData = false
          this.isLoading = false;
          // this.selectJobRole = '';
        } else {
          this.isOfficerExist = false;
          this.hasData = true
          this.isLoading = false;
        }
      }
    )
  }

  onJobRoleSelectionChange(selectedValue: string) {
    this.selectJobRole = selectedValue || '';

  }

  toggleClaimView() {
    this.showClaimView = !this.showClaimView; // Toggle the boolean value
  }

  cancelClaim() {
    this.showClaimView = false;
  }

  confirmClaim(id: number) {
    this.isLoading = true;
    this.ManageOficerSrv.claimOfficer(id).subscribe(
      (res) => {
        this.isLoading = false;
        if (res.status) {
          this.toastSrv.success(`${this.officerObj.firstNameEnglish} ${this.officerObj.lastNameEnglish} (EMP ID - "${this.officerObj.empId}") Claimed Successfully`);
          this.showClaimView = false;
          this.inputId = ''
          this.isReset = true;
          // this.selectJobRole = '';
          // Call fetchOfficer directly without navigation
          // this.fetchOfficer();
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
  regCode!: string
  image!: string
  distributedCenterName!: string
  distributedCenterRegCode!: string;
}


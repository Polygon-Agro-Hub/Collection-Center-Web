import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { Router } from '@angular/router';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-claim-officer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './claim-officer.component.html',
  styleUrl: './claim-officer.component.css'
})
export class ClaimOfficerComponent implements OnInit {
  officerObj: OfficerDetails = new OfficerDetails();

  selectJobRole: string = 'Collection Officer';
  inputId: string = '';
  isOfficerExist: boolean = false;
  hasData!: boolean


  constructor(
    private ManageOficerSrv: ManageOfficersService,
    private router: Router,
    private toastSrv: ToastAlertService
  ) { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  fetchOfficer() {
    if (!this.inputId) {
      return this.toastSrv.warning('Pleace enter valid employee id!');
    }
    let empId;
    if (this.selectJobRole === 'Customer Officer') {
      empId = 'CUO' + this.inputId
    } else {
      empId = 'COO' + this.inputId
    }
    this.ManageOficerSrv.getOfficerByEmpId(empId).subscribe(
      (res) => {
        if (res.status) {
          this.officerObj = res.data
          this.isOfficerExist = true
          this.hasData = false
        } else {
          this.isOfficerExist = false;
          this.hasData = true
        }
      }
    )
  }

  cliamBtn(id: number) {
    this.ManageOficerSrv.claimOfficer(id).subscribe(
      (res) => {
        if (res.status) {
          this.toastSrv.success(`${this.officerObj.firstNameEnglish} ${this.officerObj.lastNameEnglish} (${this.officerObj.empId}) Claim Succcessfull`);
          this.router.navigate(['/manage-officers/view-officer'])
        } else {
          this.toastSrv.error(`${this.officerObj.firstNameEnglish} ${this.officerObj.lastNameEnglish} (${this.officerObj.empId}) Claim Unscccessfull!`);
        }
      }
    )
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
}

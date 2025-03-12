import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/Auth-service/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  officerObj: Officer = new Officer();

  logingRole: string | null = null;
  isLoading:boolean = true;

  constructor(
    private AuthSrv: AuthService,
    private router: Router,
    private tokenSrv: TokenServiceService

  ) {
    this.logingRole = tokenSrv.getUserDetails().role
  }

  ngOnInit(): void {
    this.fetchLoggedInUser();
  }

  fetchLoggedInUser() {
    this.AuthSrv.getLoggedInUser().subscribe((res: any) => {
      this.officerObj = res.officerData.collectionOfficer;
      this.isLoading = false;

    });
  }

  goToChangePassword() {
    this.router.navigate(['/change-password']); // Navigate to the Change Password page
  }

  navigateToTarget() {
    this.router.navigate(['/target/view-my-target']);
  }
}

class Officer {
  id!: number;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
  phoneNumber01!: string;
  phoneNumber02!: string;
  phoneCode01!: string;
  phoneCode02!: string;
  image!: string;
  nic!: string;
  email!: string;
  houseNumber!: string;
  streetName!: string;
  city!: string;
  district!: string;
  province!: string;
  country!: string;
  empId!: string;
  jobRole!: string;
  accHolderName!: string;
  accNumber!: string;
  bankName!: string;
  branchName!: string;
  companyNameEnglish!: string;
  centerName!: string;

}

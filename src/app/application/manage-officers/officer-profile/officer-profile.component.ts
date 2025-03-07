import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { TokenServiceService } from '../../../services/Token/token-service.service';

@Component({
  selector: 'app-officer-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './officer-profile.component.html',
  styleUrls: ['./officer-profile.component.css']
})
export class OfficerProfileComponent implements OnInit {
  officerObj: Officer = new Officer();
  officerId!: number;
  showDisclaimView = false;
  logingRole: string | null = null;


  constructor(
    private ManageOficerSrv: ManageOfficersService,
    private router: Router,
    private route: ActivatedRoute,
    private toastSrv: ToastAlertService,
    private tokenSrv: TokenServiceService

  ) {
    this.logingRole = tokenSrv.getUserDetails().role

  }

  ngOnInit(): void {
    this.officerId = this.route.snapshot.params['id'];
    this.fetchOfficer(this.officerId);
  }

  fetchOfficer(id: number) {
    this.ManageOficerSrv.getOfficerById(id).subscribe((res: any) => {
      this.officerObj = res.officerData.collectionOfficer;

    });
  }

  generatePDF() {
    const reportContainer = document.getElementById('reportcontainer');

    if (reportContainer) {
      const buttons = reportContainer.querySelectorAll('button');
      buttons.forEach((btn) => (btn.style.display = 'none'));

      html2canvas(reportContainer, {
        scale: 2,
        useCORS: true,
        logging: true
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${this.officerObj.firstNameEnglish} ${this.officerObj.lastNameEnglish}(${this.officerObj.empId}).pdf`);

        buttons.forEach((btn) => (btn.style.display = 'block'));
        this.toastSrv.success(`<b>${this.officerObj.firstNameEnglish} ${this.officerObj.lastNameEnglish}(${this.officerObj.empId}).pdf</b> Downloaded!`)
      }).catch((error) => {
        console.error('Error generating PDF:', error);
      });
    }
  }

  toggleDisclaimView() {
    this.showDisclaimView = !this.showDisclaimView; // Toggle the boolean value
  }

  viewOfficerTarget(officerId: number) {
    this.router.navigate([`/manage-officers/view-officer-target/${officerId}`])
  }

  cancelDisclaim() {
    this.showDisclaimView = false;
  }

  confirmDisclaim(id: number) {

    this.ManageOficerSrv.disclaimOfficer(id).subscribe(
      (response) => {

        this.toastSrv.success('Officer ID sent successfully!');
        this.showDisclaimView = false;
        this.router.navigate(['/manage-officers/view-officer']);
      },
      (error) => {
        console.error('Error sending Officer ID:', error);
        this.toastSrv.error('Failed to send Officer ID!');
      }
    );

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




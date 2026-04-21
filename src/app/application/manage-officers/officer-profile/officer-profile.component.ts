import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import jsPDF from 'jspdf';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-officer-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './officer-profile.component.html',
  styleUrls: ['./officer-profile.component.css']
})
export class OfficerProfileComponent implements OnInit {
  officerObj: Officer = new Officer();
  officerId!: number;
  showDisclaimView = false;
  logingRole: string | null = null;
  naviPath!: string
  imagebase64: string | null = null;
  contentHeight!: number;
  isLoading: boolean = true;
  centerId!: number;

  constructor(
    private ManageOficerSrv: ManageOfficersService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toastSrv: ToastAlertService,
    private tokenSrv: TokenServiceService

  ) {
    this.logingRole = tokenSrv.getUserDetails().role
  }

  ngOnInit(): void {
    this.officerId = this.route.snapshot.params['id'];
    this.fetchOfficer(this.officerId);
    this.centerId = this.route.snapshot.params['centerId'];
    this.setActiveTabFromRoute()
    
  }

  fetchOfficer(id: number) {
    this.isLoading = true;
    this.ManageOficerSrv.getOfficerById(id).subscribe((res: any) => {
      this.officerObj = res.officerData.collectionOfficer;
      this.isLoading = false;
    });
  }

  async generatePDF() {

    if (this.officerObj.jobRole === 'Driver') {
      this.contentHeight = 397
    } else {
      this.contentHeight = 297
    }

    const doc = new jsPDF({
      unit: 'mm',
      format: [210, this.contentHeight]
    });

    const iconBase64 = 'data:image/png;base64,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...';

    const getValueOrNA = (value: string | null | undefined): string => {
      return value ? value : 'N/A';
    };

    const getValueOrNAforInsOrLiscNo = (value: number | null | undefined): string => {
      return value !== null && value !== undefined ? value.toString() : 'N/A';
    };

    function loadImageAsBase64(url: string): Promise<string> {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          const reader = new FileReader();
          reader.onloadend = function () {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = function () {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          };
          img.onerror = function () {
            resolve('');
          };
          img.src = url;
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.setRequestHeader('Accept', 'image/png;image/*');
        try {
          xhr.send();
        } catch (error) {
          reject(error);
        }
      });
    }

    const hasImage = !!this.officerObj.image;

    if (hasImage) {
      const appendCacheBuster = (url: string) => {
        if (!url) return '';
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}t=${new Date().getTime()}`;
      };

      const img = new Image();
      const modifiedFarmerUrl = appendCacheBuster(this.officerObj.image);
      img.src = await loadImageAsBase64(modifiedFarmerUrl);

      doc.saveGraphicsState();
      doc.addImage(img, 'JPEG', 14, 10, 40, 40);
      doc.restoreGraphicsState();
    }

    const startX = hasImage ? 60 : 14;
    const startY = hasImage ? 60 : 50;

    const imageboxX = 10;
    const imageboxY = 8;
    const imageboxWidth = 190;
    const imageboxHeight = hasImage ? 44 : 30;

    doc.setDrawColor(241, 247, 250);
    doc.setLineWidth(0.5);
    doc.roundedRect(imageboxX, imageboxY, imageboxWidth, imageboxHeight, 3, 3, "S");

    const personalboxX = 10;
    const personalboxY = startY - 6;
    const personalboxWidth = 190;
    const personalboxHeight = 57;

    doc.setDrawColor(241, 247, 250);
    doc.setLineWidth(0.5);
    doc.roundedRect(personalboxX, personalboxY, personalboxWidth, personalboxHeight, 3, 3, "S");

    doc.setFontSize(14);
    doc.text("Personal Information", 14, startY);

    doc.setFontSize(12);
    doc.text(getValueOrNA(this.officerObj.firstNameEnglish) + ' ' + getValueOrNA(this.officerObj.lastNameEnglish), startX, 15);

    let empType = '';
    let empCode = '';

    switch (this.officerObj.jobRole) {
      case 'Customer Officer':
        empType = 'Customer Officer';
        empCode = 'CUO';
        break;
      case 'Collection Centre Manager':
        empType = 'Collection Centre Manager';
        empCode = 'CCM';
        break;
      case 'Collection Centre Head':
        empType = 'Collection Centre Head';
        empCode = 'CCH';
        break;
      case 'Collection Officer':
        empType = 'Collection Officer';
        empCode = 'COO';
        break;
      case 'Driver':
        empType = 'Driver';
        empCode = 'DVR';
        break;
      case 'Distribution Centre Head':
        empType = 'Distribution Centre Head';
        empCode = 'DCH';
        break;
      case 'Distribution Centre Manager':
        empType = 'Distribution Centre Manager';
        empCode = 'DCM';
        break;
      case 'Distribution Officer':
        empType = 'Distribution Officer';
        empCode = 'DIO';
        break;
    }

    let empId = this.officerObj.empId || '';
    let empCodeText = empCode ? `${empCode}${empId}` : empId;

    let empTypeText = `${getValueOrNA(empType)} - `;
    doc.text(empTypeText, startX, 22);

    let textWidth = doc.getTextWidth(empTypeText);
    doc.text(getValueOrNA(empCodeText), startX + textWidth, 22);

    let centerText = 'Officer has been disclaimed - No Assigned Centre';

    const ccRoles = ['Collection Centre Manager', 'Collection Centre Head', 'Collection Officer', 'Customer Officer'];
    const dcRoles = ['Distribution Centre Manager', 'Distribution Centre Head', 'Distribution Officer', 'Driver'];

    if (ccRoles.includes(this.officerObj.jobRole)) {
      if (this.officerObj.regCode) {
        centerText = `${this.officerObj.regCode} Centre`;
      }
    } else if (dcRoles.includes(this.officerObj.jobRole)) {
      if (this.officerObj.distributedCenterRegCode) {
        centerText = `${this.officerObj.distributedCenterRegCode} Centre`;
      }
    }

    doc.text(centerText, startX, 29);
    doc.text(getValueOrNA(this.officerObj.companyNameEnglish), startX, 36);

    doc.setFontSize(12);

    // First Name
    doc.text("First Name", 14, startY + 10);
    doc.text(getValueOrNA(this.officerObj.firstNameEnglish), 14, startY + 16);

    // Last Name
    doc.text("Last Name", 100, startY + 10);
    doc.text(getValueOrNA(this.officerObj.lastNameEnglish), 100, startY + 16);

    // NIC Number
    doc.text("NIC Number", 14, startY + 26);
    doc.text(getValueOrNA(this.officerObj.nic), 14, startY + 32);

    // Email
    doc.text("Email", 100, startY + 26);
    doc.text(getValueOrNA(this.officerObj.email), 100, startY + 32);

    // Mobile Number 1
    doc.text("Mobile Number - 1", 14, startY + 42);
    if (this.officerObj.phoneNumber01 == null || this.officerObj.phoneNumber01 === "") {
      doc.text("N/A", 14, startY + 48);
    } else {
      doc.text(getValueOrNA(this.officerObj.phoneCode02), 14, startY + 48);
      doc.text(getValueOrNA(this.officerObj.phoneNumber01), 22, startY + 48);
    }

    // Mobile Number 2
    doc.text("Mobile Number - 2", 100, startY + 42);
    if (this.officerObj.phoneNumber02 == null || this.officerObj.phoneNumber02 === "") {
      doc.text("-", 100, startY + 48);
    } else {
      doc.text(getValueOrNA(this.officerObj.phoneCode02), 100, startY + 48);
      doc.text(getValueOrNA(this.officerObj.phoneNumber02), 108, startY + 48);
    }

    // Address Details Section
    const boxX = 10;
    const boxY = startY + 54;
    const boxWidth = 190;
    const lastY = startY + 108;
    const boxHeight = (lastY + 4) - boxY;

    doc.setDrawColor(241, 247, 250);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, "S");

    doc.setFontSize(14);
    doc.text("Address Details", 14, startY + 60);

    doc.setFontSize(12);

    doc.text("House / Plot Number", 14, startY + 70);
    doc.text(getValueOrNA(this.officerObj.houseNumber), 14, startY + 76);

    doc.text("Street Name", 100, startY + 70);
    doc.text(getValueOrNA(this.officerObj.streetName), 100, startY + 76);

    doc.text("City", 14, startY + 86);
    doc.text(getValueOrNA(this.officerObj.city), 14, startY + 92);

    doc.text("Country", 100, startY + 86);
    doc.text(getValueOrNA(this.officerObj.country), 100, startY + 92);

    doc.text("Province", 14, startY + 102);
    doc.text(getValueOrNA(this.officerObj.province), 14, startY + 108);

    doc.text("District", 100, startY + 102);
    doc.text(getValueOrNA(this.officerObj.district), 100, startY + 108);

    // Bank Details Section
    const bankBoxX = 10;
    const bankBoxY = startY + 114;
    const bankBoxWidth = 190;
    const bankLastY = startY + 152;
    const bankBoxHeight = (bankLastY + 4) - bankBoxY;

    doc.setDrawColor(241, 247, 250);
    doc.setLineWidth(0.5);
    doc.roundedRect(bankBoxX, bankBoxY, bankBoxWidth, bankBoxHeight, 3, 3, "S");

    doc.setFontSize(14);
    doc.text("Bank Details", 14, startY + 120);

    doc.setFontSize(12);

    doc.text("Account Holder's Name", 14, startY + 130);
    doc.text(getValueOrNA(this.officerObj.accHolderName), 14, startY + 136);

    doc.text("Account Number", 100, startY + 130);
    doc.text(getValueOrNA(this.officerObj.accNumber), 100, startY + 136);

    doc.text("Bank Name", 14, startY + 146);
    doc.text(getValueOrNA(this.officerObj.bankName), 14, startY + 152);

    doc.text("Branch Name", 100, startY + 146);
    doc.text(getValueOrNA(this.officerObj.branchName), 100, startY + 152);

    if (this.officerObj.jobRole === 'Driver') {

      const DdetailsX = 10;
      const DdetailsY = startY + 158;
      const DdetailsboxWidth = 190;
      const DdetailslastY = startY + 198;
      const DdetailsboxHeight = (DdetailslastY + 4) - DdetailsY;

      doc.setDrawColor(241, 247, 250);
      doc.setLineWidth(0.5);
      doc.roundedRect(DdetailsX, DdetailsY, DdetailsboxWidth, DdetailsboxHeight, 3, 3, "S");

      doc.setFontSize(16);
      doc.text("Driver Details", 14, startY + 164);

      doc.setFontSize(12);
      doc.text("Driving License ID", 14, startY + 174);
      doc.text(getValueOrNAforInsOrLiscNo(this.officerObj.licNo), 14, startY + 180);

      doc.text("License's Front Image", 14, startY + 190);
      doc.addImage(iconBase64, 'PNG', 14, startY + 192, 9, 9);
      if (this.officerObj.licFrontImg) {
        doc.link(14, startY + 192, 9, 9, { url: this.officerObj.licFrontImg });
      }

      doc.text("License's Back Image", 100, startY + 190);
      doc.addImage(iconBase64, 'PNG', 100, startY + 192, 9, 9);
      if (this.officerObj.licBackImg) {
        doc.link(100, startY + 192, 9, 9, { url: this.officerObj.licBackImg });
      }

      const VidetailsX = 10;
      const VidetailsY = startY + 204;
      const VidetailsboxWidth = 190;
      const VidetailslastY = startY + 248;
      const VidetailsboxHeight = (VidetailslastY + 4) - VidetailsY;

      doc.setDrawColor(241, 247, 250);
      doc.setLineWidth(0.5);
      doc.roundedRect(VidetailsX, VidetailsY, VidetailsboxWidth, VidetailsboxHeight, 3, 3, "S");

      doc.setFontSize(16);
      doc.text("Vehicle Insurance Details", 14, startY + 212);

      doc.setFontSize(12);
      doc.text("Vehicle Insurance Number", 14, startY + 222);
      doc.text(getValueOrNAforInsOrLiscNo(this.officerObj.insNo), 14, startY + 228);

      doc.text("Vehicle Expire Date", 100, startY + 222);
      doc.text(this.officerObj.insExpDate.split("T")[0], 100, startY + 228);

      doc.text("Insurance's Front Image", 14, startY + 238);
      doc.addImage(iconBase64, 'PNG', 14, startY + 240, 9, 9);
      if (this.officerObj.insFrontImg) {
        doc.link(14, startY + 240, 9, 9, { url: this.officerObj.insFrontImg });
      }

      doc.text("Insurance's Back Image", 100, startY + 238);
      doc.addImage(iconBase64, 'PNG', 100, startY + 240, 9, 9);
      if (this.officerObj.insBackImg) {
        doc.link(100, startY + 240, 9, 9, { url: this.officerObj.insBackImg });
      }

      const VdetailsX = 10;
      const VdetailsY = startY + 254;
      const VdetailsboxWidth = 190;
      const VdetailslastY = startY + 330;
      const VdetailsboxHeight = (VdetailslastY + 4) - VdetailsY;

      doc.setDrawColor(241, 247, 250);
      doc.setLineWidth(0.5);
      doc.roundedRect(VdetailsX, VdetailsY, VdetailsboxWidth, VdetailsboxHeight, 3, 3, "S");

      doc.setFontSize(16);
      doc.text("Vehicle Details", 14, startY + 260);

      doc.setFontSize(12);
      doc.text("Vehicle Registration Number", 14, startY + 270);
      doc.text(getValueOrNA(this.officerObj.vRegNo), 14, startY + 276);

      doc.text("Vehicle Type", 14, startY + 286);
      doc.text(getValueOrNA(this.officerObj.vType), 14, startY + 292);

      doc.text("Vehicle Capacity", 100, startY + 286);
      let value = getValueOrNA(String(this.officerObj.vCapacity));
      doc.text(value === "N/A" ? value : value + " Kg", 100, startY + 292);

      doc.text("Vehicle's Front Image", 14, startY + 302);
      doc.addImage(iconBase64, 'PNG', 14, startY + 304, 9, 9);
      if (this.officerObj.vehFrontImg) {
        doc.link(14, startY + 304, 9, 9, { url: this.officerObj.vehFrontImg });
      }

      doc.text("Vehicle's Back Image", 100, startY + 302);
      doc.addImage(iconBase64, 'PNG', 100, startY + 304, 9, 9);
      if (this.officerObj.vehBackImg) {
        doc.link(100, startY + 304, 9, 9, { url: this.officerObj.vehBackImg });
      }

      doc.text("Vehicle's Side Image - 1", 14, startY + 320);
      doc.addImage(iconBase64, 'PNG', 14, startY + 322, 9, 9);
      if (this.officerObj.vehSideImgA) {
        doc.link(14, startY + 322, 9, 9, { url: this.officerObj.vehSideImgA });
      }

      doc.text("Vehicle's Side Image - 2", 100, startY + 320);
      doc.addImage(iconBase64, 'PNG', 100, startY + 322, 9, 9);
      if (this.officerObj.vehSideImgB) {
        doc.link(100, startY + 322, 9, 9, { url: this.officerObj.vehSideImgB, newWindow: true });
      }
    }

    doc.save(`${getValueOrNA(this.officerObj.empIdPrefix)}-${getValueOrNA(this.officerObj.firstNameEnglish)} ${getValueOrNA(this.officerObj.lastNameEnglish)}.pdf`);
  }

  toggleDisclaimView() {
    this.showDisclaimView = !this.showDisclaimView; // Toggle the boolean value
  }

  viewOfficerTargetDistribution(officerId: number, centerName: string, centerId: number, empId: string) {
    this.router.navigate([`/distribution-officers/view-distribution-officer-target/${officerId}/${centerName}/${centerId}/${empId}`]);
  }

  viewOfficerTarget(officerId: number, centerName: string) {

    const newCenterName = centerName ? centerName : 'Disclaimed'
    if (this.logingRole === 'Collection Centre Head' || this.logingRole === 'Collection Centre Manager') {
      this.router.navigate([`/manage-officers/view-officer-target/${officerId}/${newCenterName}`]);
    } else if (this.logingRole === 'Distribution Centre Head' || this.logingRole === 'Distribution Centre Manager') {
      this.router.navigate([`/distribution-officers/view-distribution-officer-target/${officerId}/${centerName}`]);
    } 
  }

  cancelDisclaim() {
    this.showDisclaimView = false;

  }

  confirmDisclaim(id: number) {
    this.isLoading = true;

    this.ManageOficerSrv.disclaimOfficer(id).subscribe(
      (response) => {
        this.isLoading = false;
        this.showDisclaimView = false;
        this.fetchOfficer(this.officerId);      
        this.toastSrv.success('Officer Disclaimed Successfully!');
        this.location.back();
      },
      (error) => {
        console.error('Error sending Officer ID:', error);
        this.isLoading = false;
        this.toastSrv.error('Failed to Disclam the Officer!');
        if (this.logingRole === 'Distribution Centre Manager') {
          this.router.navigate(['/distribution-officers']);
        } else if (this.logingRole === 'Collection Centre Manager') {
          this.router.navigate(['/manage-officers']);
        }
      }
    );

  }

  private setActiveTabFromRoute(): void {
    const currentPath = this.router.url.split('?')[0];
    // Extract the first segment after the initial slash
    this.naviPath = currentPath.split('/')[1];
  }

  navigateToCenterDashboard() {
    this.router.navigate(['/centers/center-shashbord', this.centerId]); // Change '/reports' to your desired route
  }

  navigateToCenters() {
    this.router.navigate(['/centers']); // Change '/reports' to your desired route
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
  empIdPrefix!: string;
  jobRole!: string;
  accHolderName!: string;
  accNumber!: string;
  bankName!: string;
  branchName!: string;
  companyNameEnglish!: string;
  centerName!: string;
  base64Image!: string;
  distributedCenterId!: number;
  distributedCenterName!: string;
  distributedCenterRegCode!: string;
  regCode!: string;
  claimStatus!: number;


  //driver
  licNo!: number;
  insNo!: number;
  insExpDate!: string;
  vType!: string;
  vCapacity!: string;
  vRegNo!: string;
  licFrontImg!: string;
  licBackImg!: string;
  insFrontImg!: string;
  insBackImg!: string;
  vehFrontImg!: string;
  vehBackImg!: string;
  vehSideImgA!: string;
  vehSideImgB!: string;

}







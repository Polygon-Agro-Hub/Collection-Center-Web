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
      this.contentHeight = 420
    } else {
      this.contentHeight = 320
    }

    const doc = new jsPDF({
      unit: 'mm',
      format: [210, this.contentHeight]
    });

    const iconBase64 = 'data:image/png;base64,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';

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
      doc.addImage(img, 'JPEG', 16, 12, 40, 40);
      doc.restoreGraphicsState();
    }

    const startX = hasImage ? 62 : 16;
    const startY = hasImage ? 62 : 52;

    // ─── Header Box ───────────────────────────────────────────
    const imageboxX = 10;
    const imageboxY = 8;
    const imageboxWidth = 190;
    const imageboxHeight = hasImage ? 46 : 32;

    doc.setDrawColor(241, 247, 250);
    doc.setLineWidth(0.5);
    doc.roundedRect(imageboxX, imageboxY, imageboxWidth, imageboxHeight, 3, 3, "S");

    doc.setFontSize(12);
    doc.text(getValueOrNA(this.officerObj.firstNameEnglish) + ' ' + getValueOrNA(this.officerObj.lastNameEnglish), startX, 17);

    let empType = '';
    let empCode = '';

    switch (this.officerObj.jobRole) {
      case 'Customer Officer':         empType = 'Customer Officer';           empCode = 'CUO'; break;
      case 'Collection Centre Manager': empType = 'Collection Centre Manager'; empCode = 'CCM'; break;
      case 'Collection Centre Head':    empType = 'Collection Centre Head';    empCode = 'CCH'; break;
      case 'Collection Officer':        empType = 'Collection Officer';        empCode = 'COO'; break;
      case 'Driver':                    empType = 'Driver';                    empCode = 'DVR'; break;
      case 'Distribution Centre Head':  empType = 'Distribution Centre Head';  empCode = 'DCH'; break;
      case 'Distribution Centre Manager': empType = 'Distribution Centre Manager'; empCode = 'DCM'; break;
      case 'Distribution Officer':      empType = 'Distribution Officer';      empCode = 'DIO'; break;
    }

    let empId = this.officerObj.empId || '';
    let empCodeText = empCode ? `${empCode}${empId}` : empId;
    let empTypeText = `${getValueOrNA(empType)} - `;
    doc.text(empTypeText, startX, 24);
    let textWidth = doc.getTextWidth(empTypeText);
    doc.text(getValueOrNA(empCodeText), startX + textWidth, 24);

    let centerText = 'Officer has been disclaimed - No Assigned Centre';
    const ccRoles = ['Collection Centre Manager', 'Collection Centre Head', 'Collection Officer', 'Customer Officer'];
    const dcRoles = ['Distribution Centre Manager', 'Distribution Centre Head', 'Distribution Officer', 'Driver'];

    if (ccRoles.includes(this.officerObj.jobRole)) {
      if (this.officerObj.regCode) centerText = `${this.officerObj.regCode} Centre`;
    } else if (dcRoles.includes(this.officerObj.jobRole)) {
      if (this.officerObj.distributedCenterRegCode) centerText = `${this.officerObj.distributedCenterRegCode} Centre`;
    }

    doc.text(centerText, startX, 31);
    doc.text(getValueOrNA(this.officerObj.companyNameEnglish), startX, 38);

    // ─── Personal Information Box ──────────────────────────────
    const sectionGap = 8; // gap between sections

    const personalboxX = 10;
    const personalboxY = startY - 8;
    const personalboxWidth = 190;
    const personalboxHeight = 68;

    doc.setDrawColor(241, 247, 250);
    doc.setLineWidth(0.5);
    doc.roundedRect(personalboxX, personalboxY, personalboxWidth, personalboxHeight, 3, 3, "S");

    doc.setFontSize(14);
    doc.text("Personal Information", 16, startY);

    doc.setFontSize(12);

    doc.text("First Name", 16, startY + 12);
    doc.text(getValueOrNA(this.officerObj.firstNameEnglish), 16, startY + 19);

    doc.text("Last Name", 105, startY + 12);
    doc.text(getValueOrNA(this.officerObj.lastNameEnglish), 105, startY + 19);

    doc.text("NIC Number", 16, startY + 29);
    doc.text(getValueOrNA(this.officerObj.nic), 16, startY + 36);

    doc.text("Email", 105, startY + 29);
    doc.text(getValueOrNA(this.officerObj.email), 105, startY + 36);

    doc.text("Mobile Number - 1", 16, startY + 46);
    if (this.officerObj.phoneNumber01 == null || this.officerObj.phoneNumber01 === "") {
      doc.text("N/A", 16, startY + 53);
    } else {
      doc.text(getValueOrNA(this.officerObj.phoneCode01), 16, startY + 53);
      doc.text(getValueOrNA(this.officerObj.phoneNumber01), 25, startY + 53);
    }

    doc.text("Mobile Number - 2", 105, startY + 46);
    if (this.officerObj.phoneNumber02 == null || this.officerObj.phoneNumber02 === "") {
      doc.text("-", 105, startY + 53);
    } else {
      doc.text(getValueOrNA(this.officerObj.phoneCode02), 105, startY + 53);
      doc.text(getValueOrNA(this.officerObj.phoneNumber02), 114, startY + 53);
    }

    // ─── Address Details Box ───────────────────────────────────
    const addrY = personalboxY + personalboxHeight + sectionGap;

    doc.setDrawColor(241, 247, 250);
    doc.setLineWidth(0.5);
    doc.roundedRect(10, addrY, 190, 68, 3, 3, "S");

    doc.setFontSize(14);
    doc.text("Address Details", 16, addrY + 10);

    doc.setFontSize(12);

    doc.text("House / Plot Number", 16, addrY + 22);
    doc.text(getValueOrNA(this.officerObj.houseNumber), 16, addrY + 29);

    doc.text("Street Name", 105, addrY + 22);
    doc.text(getValueOrNA(this.officerObj.streetName), 105, addrY + 29);

    doc.text("City", 16, addrY + 39);
    doc.text(getValueOrNA(this.officerObj.city), 16, addrY + 46);

    doc.text("Country", 105, addrY + 39);
    doc.text(getValueOrNA(this.officerObj.country), 105, addrY + 46);

    doc.text("Province", 16, addrY + 56);
    doc.text(getValueOrNA(this.officerObj.province), 16, addrY + 63);

    doc.text("District", 105, addrY + 56);
    doc.text(getValueOrNA(this.officerObj.district), 105, addrY + 63);

    // ─── Bank Details Box ──────────────────────────────────────
    const bankY = addrY + 68 + sectionGap;

    doc.setDrawColor(241, 247, 250);
    doc.setLineWidth(0.5);
    doc.roundedRect(10, bankY, 190, 52, 3, 3, "S");

    doc.setFontSize(14);
    doc.text("Bank Details", 16, bankY + 10);

    doc.setFontSize(12);

    doc.text("Account Holder's Name", 16, bankY + 22);
    doc.text(getValueOrNA(this.officerObj.accHolderName), 16, bankY + 29);

    doc.text("Account Number", 105, bankY + 22);
    doc.text(getValueOrNA(this.officerObj.accNumber), 105, bankY + 29);

    doc.text("Bank Name", 16, bankY + 39);
    doc.text(getValueOrNA(this.officerObj.bankName), 16, bankY + 46);

    doc.text("Branch Name", 105, bankY + 39);
    doc.text(getValueOrNA(this.officerObj.branchName), 105, bankY + 46);

    // ─── Driver Sections ───────────────────────────────────────
    if (this.officerObj.jobRole === 'Driver') {

      // Driver Details
      const driverY = bankY + 52 + sectionGap;

      doc.setDrawColor(241, 247, 250);
      doc.setLineWidth(0.5);
      doc.roundedRect(10, driverY, 190, 52, 3, 3, "S");

      doc.setFontSize(14);
      doc.text("Driver Details", 16, driverY + 10);

      doc.setFontSize(12);

      doc.text("Driving License ID", 16, driverY + 22);
      doc.text(getValueOrNAforInsOrLiscNo(this.officerObj.licNo), 16, driverY + 29);

      doc.text("License's Front Image", 16, driverY + 39);
      doc.addImage(iconBase64, 'PNG', 16, driverY + 42, 9, 9);
      if (this.officerObj.licFrontImg) {
        doc.link(16, driverY + 42, 9, 9, { url: this.officerObj.licFrontImg });
      }

      doc.text("License's Back Image", 105, driverY + 39);
      doc.addImage(iconBase64, 'PNG', 105, driverY + 42, 9, 9);
      if (this.officerObj.licBackImg) {
        doc.link(105, driverY + 42, 9, 9, { url: this.officerObj.licBackImg });
      }

      // Vehicle Insurance Details
      const insY = driverY + 52 + sectionGap;

      doc.setDrawColor(241, 247, 250);
      doc.setLineWidth(0.5);
      doc.roundedRect(10, insY, 190, 52, 3, 3, "S");

      doc.setFontSize(14);
      doc.text("Vehicle Insurance Details", 16, insY + 10);

      doc.setFontSize(12);

      doc.text("Vehicle Insurance Number", 16, insY + 22);
      doc.text(getValueOrNAforInsOrLiscNo(this.officerObj.insNo), 16, insY + 29);

      doc.text("Vehicle Expire Date", 105, insY + 22);
      doc.text(this.officerObj.insExpDate.split("T")[0], 105, insY + 29);

      doc.text("Insurance's Front Image", 16, insY + 39);
      doc.addImage(iconBase64, 'PNG', 16, insY + 42, 9, 9);
      if (this.officerObj.insFrontImg) {
        doc.link(16, insY + 42, 9, 9, { url: this.officerObj.insFrontImg });
      }

      doc.text("Insurance's Back Image", 105, insY + 39);
      doc.addImage(iconBase64, 'PNG', 105, insY + 42, 9, 9);
      if (this.officerObj.insBackImg) {
        doc.link(105, insY + 42, 9, 9, { url: this.officerObj.insBackImg });
      }

      // Vehicle Details
      const vehY = insY + 52 + sectionGap;

      doc.setDrawColor(241, 247, 250);
      doc.setLineWidth(0.5);
      doc.roundedRect(10, vehY, 190, 85, 3, 3, "S");

      doc.setFontSize(14);
      doc.text("Vehicle Details", 16, vehY + 10);

      doc.setFontSize(12);

      doc.text("Vehicle Registration Number", 16, vehY + 22);
      doc.text(getValueOrNA(this.officerObj.vRegNo), 16, vehY + 29);

      doc.text("Vehicle Type", 16, vehY + 39);
      doc.text(getValueOrNA(this.officerObj.vType), 16, vehY + 46);

      doc.text("Vehicle Capacity", 105, vehY + 39);
      let value = getValueOrNA(String(this.officerObj.vCapacity));
      doc.text(value === "N/A" ? value : value + " Kg", 105, vehY + 46);

      doc.text("Vehicle's Front Image", 16, vehY + 56);
      doc.addImage(iconBase64, 'PNG', 16, vehY + 59, 9, 9);
      if (this.officerObj.vehFrontImg) {
        doc.link(16, vehY + 59, 9, 9, { url: this.officerObj.vehFrontImg });
      }

      doc.text("Vehicle's Back Image", 105, vehY + 56);
      doc.addImage(iconBase64, 'PNG', 105, vehY + 59, 9, 9);
      if (this.officerObj.vehBackImg) {
        doc.link(105, vehY + 59, 9, 9, { url: this.officerObj.vehBackImg });
      }

      doc.text("Vehicle's Side Image - 1", 16, vehY + 73);
      doc.addImage(iconBase64, 'PNG', 16, vehY + 76, 9, 9);
      if (this.officerObj.vehSideImgA) {
        doc.link(16, vehY + 76, 9, 9, { url: this.officerObj.vehSideImgA });
      }

      doc.text("Vehicle's Side Image - 2", 105, vehY + 73);
      doc.addImage(iconBase64, 'PNG', 105, vehY + 76, 9, 9);
      if (this.officerObj.vehSideImgB) {
        doc.link(105, vehY + 76, 9, 9, { url: this.officerObj.vehSideImgB, newWindow: true });
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







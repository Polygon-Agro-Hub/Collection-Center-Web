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

  async generatePDF() {
    console.log('downloading')
    const doc = new jsPDF();

    // function loadImageAsBase64(url: string): Promise<string> {
    //   return new Promise((resolve, reject) => {
    //     const xhr = new XMLHttpRequest();
    //     xhr.onload = function () {
    //       const reader = new FileReader();
    //       reader.onloadend = function () {
    //         resolve(reader.result as string);
    //       };
    //       reader.readAsDataURL(xhr.response);
    //     };
    //     xhr.onerror = function () {
    //       // If XHR fails, try loading image directly
    //       const img = new Image();
    //       img.crossOrigin = 'Anonymous';
    //       img.onload = function () {
    //         const canvas = document.createElement('canvas');
    //         const ctx = canvas.getContext('2d');
    //         canvas.width = img.width;
    //         canvas.height = img.height;
    //         ctx?.drawImage(img, 0, 0);
    //         resolve(canvas.toDataURL('image/png'));
    //       };
    //       img.onerror = function () {
    //         console.warn('Image load failed:', url);
    //         resolve(''); // Resolve with empty string if image fails to load
    //       };
    //       img.src = url;
    //     };
    //     xhr.open('GET', url);
    //     xhr.responseType = 'blob';
    //     xhr.setRequestHeader('Accept', 'image/png;image/*');
    //     try {
    //       xhr.send();
    //     } catch (error) {
    //       console.error('XHR send error:', error);
    //       reject(error);
    //     }
    //   });
    // }

    // Title
    doc.setFontSize(16);
    doc.setFont("Inter", "bold");
    doc.text("Personal Information", 14, 20);

    doc.setFontSize(12);
    doc.setFont("Inter", "normal");

    // First Name
    doc.text("First Name", 14, 30);
    doc.setFont("Inter", "bold");
    doc.text(this.officerObj.firstNameEnglish, 14, 36);

    // Last Name
    doc.setFont("Inter", "normal");
    doc.text("Last Name", 100, 30);
    doc.setFont("Inter", "bold");
    doc.text(this.officerObj.lastNameEnglish, 100, 36);

    // NIC Number
    doc.setFont("Inter", "normal");
    doc.text("NIC Number", 14, 46);
    doc.setFont("Inter", "bold");
    doc.text(this.officerObj.nic, 14, 52);

    // Email
    doc.setFont("Inter", "normal");
    doc.text("Email", 100, 46);
    doc.setFont("Inter", "bold");
    doc.text(this.officerObj.email, 100, 52);

    // Phone Number 1
    doc.setFont("Inter", "normal");
    doc.text("Phone Number - 1", 14, 62);
    doc.setFont("Inter", "bold");
    doc.text(this.officerObj.phoneNumber01, 14, 68);

    // Phone Number 2
    doc.setFont("Inter", "normal");
    doc.text("Phone Number - 2", 100, 62);
    doc.setFont("Inter", "bold");
    doc.text(this.officerObj.phoneNumber02, 100, 68);

    // Address Details Section
    doc.setFontSize(16);
    doc.setFont("Inter", "bold");
    doc.text("Address Details", 14, 80);

    doc.setFontSize(12);
    doc.setFont("Inter", "normal");

    // House / Plot Number
    doc.text("House / Plot Number", 14, 90);
    doc.setFont("Inter", "bold");
    doc.text(this.officerObj.houseNumber, 14, 96);

    // Street Name
    doc.setFont("Inter", "normal");
    doc.text("Street Name", 100, 90);
    doc.setFont("Inter", "bold");
    doc.text(this.officerObj.streetName, 100, 96);

    // City
    doc.setFont("Inter", "normal");
    doc.text("City", 14, 106);
    doc.setFont("Inter", "bold");
    doc.text(this.officerObj.city, 14, 112);

    // Country
    doc.setFont("Inter", "normal");
    doc.text("Country", 100, 106);
    doc.setFont("Inter", "bold");
    doc.text(this.officerObj.country, 100, 112);

    // Province
    doc.setFont("Inter", "normal");
    doc.text("Province", 14, 122);
    doc.setFont("Inter", "bold");
    doc.text(this.officerObj.province, 14, 128);

    // District
    doc.setFont("Inter", "normal");
    doc.text("District", 100, 122);
    doc.setFont("Inter", "bold");
    doc.text(this.officerObj.district, 100, 128);

    // Bank Details Section
    doc.setFontSize(16);
    doc.setFont("Inter", "bold");
    doc.text("Bank Details", 14, 140);

    doc.setFontSize(12);
    doc.setFont("Inter", "normal");

    // Account Holder Name
    doc.text("Account Holder’s Name", 14, 150);
    doc.setFont("Inter", "bold");
    doc.text(this.officerObj.accHolderName, 14, 156);

    // Account Number
    doc.setFont("Inter", "normal");
    doc.text("Account Number", 100, 150);
    doc.setFont("Inter", "bold");
    doc.text(this.officerObj.accNumber, 100, 156);

    // Bank Name
    doc.setFont("Inter", "normal");
    doc.text("Bank Name", 14, 166);
    doc.setFont("Inter", "bold");
    doc.text(this.officerObj.bankName, 14, 172);

    // Branch Name
    doc.setFont("Inter", "normal");
    doc.text("Branch Name", 100, 166);
    doc.setFont("Inter", "bold");
    doc.text(this.officerObj.branchName, 100, 172);

    // try {
    //   let imagebase64 = '';


    //   if (this.officerObj.image) {

    //     imagebase64 = await loadImageAsBase64(this.officerObj.image);
    //   }

    //   if (imagebase64) {
    //     doc.text(imagebase64, 14, 178);
        
    //   }

      
    // } catch (error) {
    //   console.error('Error adding QR codes:', error);
    //   doc.setTextColor(255, 0, 0);
    //   doc.text('Error loading QR codes', 10, 178);
    //   doc.setTextColor(0, 0, 0);
    // }
    
    

      // Save PDF
    doc.save(`Personal_Details_${this.officerObj.firstNameEnglish}.pdf`);
    

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




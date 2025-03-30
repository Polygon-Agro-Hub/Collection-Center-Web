import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
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
  naviPath!:string

  isLoading: boolean = true;



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
    console.log('downloading');
    const doc = new jsPDF();

    // Helper function to check for empty, null, or undefined values
    const getValueOrNA = (value: string | null | undefined): string => {
        return value ? value : 'N/A';
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
                // If XHR fails, try loading image directly
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
                    console.warn('Image load failed:', url);
                    resolve(''); // Resolve with empty string if image fails to load
                };
                img.src = url;
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.setRequestHeader('Accept', 'image/png;image/*');
            try {
                xhr.send();
            } catch (error) {
                console.error('XHR send error:', error);
                reject(error);
            }
        });
    }

    const appendCacheBuster = (url: string) => {
        if (!url) return '';
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}t=${new Date().getTime()}`;
    };

    // Load the image first
    let imagebase64 = '';
    try {
        if (this.officerObj.image) {
            const modifiedImageUrl = appendCacheBuster(this.officerObj.image);
            imagebase64 = await loadImageAsBase64(modifiedImageUrl);
        }
    } catch (error) {
        console.error('Error loading image:', error);
    }

    // Add the image at the top if it exists
    if (imagebase64) {
        doc.addImage(
            imagebase64,
            'PNG',
            14, // X position
            10, // Y position (moved to top)
            40, // Width
            40  // Height
        );
    }

    // Adjust starting positions based on image presence
    const startX = imagebase64 ? 60 : 14; // If no image, start from left margin
    const startY = imagebase64 ? 60 : 50; // Adjust Y position based on image presence

    // Title
    doc.setFontSize(16);
    doc.setFont("Inter", "bold");
    doc.text("Personal Information", 14, startY);

    // Name and position info - position adjusted based on image presence
    doc.setFontSize(12);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.firstNameEnglish) + ' ' + getValueOrNA(this.officerObj.lastNameEnglish), startX, 15);
    
    doc.setFont("Inter", "normal");
    doc.text('Customer Officer  - ', startX, 22);

    let empCode = '';
    if (this.officerObj.jobRole === 'Customer Officer') {
        empCode = 'CUO';
    } else if (this.officerObj.jobRole === 'Collection Center Manager') {
        empCode = 'CCM';
    } else if (this.officerObj.jobRole === 'Collection Center Head') {
        empCode = 'CCH';
    } else if (this.officerObj.jobRole === 'Collection Officer') {
        empCode = 'COO';
    }

    // Apply bold font for the empCode + empId
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(empCode + this.officerObj.empId), startX + 35, 22);
    
    doc.text(getValueOrNA(this.officerObj.city), startX, 29);
    doc.setFont("Inter", "normal");
    doc.text(getValueOrNA(this.officerObj.companyNameEnglish), startX, 36);

    doc.setFontSize(12);
    doc.setFont("Inter", "normal");

    // First Name
    doc.text("First Name", 14, startY + 10);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.firstNameEnglish), 14, startY + 16);

    // Last Name
    doc.setFont("Inter", "normal");
    doc.text("Last Name", 100, startY + 10);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.lastNameEnglish), 100, startY + 16);

    // NIC Number
    doc.setFont("Inter", "normal");
    doc.text("NIC Number", 14, startY + 26);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.nic), 14, startY + 32);

    // Email
    doc.setFont("Inter", "normal");
    doc.text("Email", 100, startY + 26);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.email), 100, startY + 32);

    // Phone Number 1
    doc.setFont("Inter", "normal");
    doc.text("Phone Number - 1", 14, startY + 42);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.phoneNumber01), 22, startY + 48);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.phoneCode02), 14, startY + 48);

    // Phone Number 2
    doc.setFont("Inter", "normal");
    doc.text("Phone Number - 2", 100, startY + 42);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.phoneNumber02), 108, startY + 48);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.phoneCode02), 100, startY + 48);

    // Address Details Section
    doc.setFontSize(16);
    doc.setFont("Inter", "bold");
    doc.text("Address Details", 14, startY + 60);

    doc.setFontSize(12);
    doc.setFont("Inter", "normal");

    // House / Plot Number
    doc.text("House / Plot Number", 14, startY + 70);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.houseNumber), 14, startY + 76);

    // Street Name
    doc.setFont("Inter", "normal");
    doc.text("Street Name", 100, startY + 70);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.streetName), 100, startY + 76);

    // City
    doc.setFont("Inter", "normal");
    doc.text("City", 14, startY + 86);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.city), 14, startY + 92);

    // Country
    doc.setFont("Inter", "normal");
    doc.text("Country", 100, startY + 86);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.country), 100, startY + 92);

    // Province
    doc.setFont("Inter", "normal");
    doc.text("Province", 14, startY + 102);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.province), 14, startY + 108);

    // District
    doc.setFont("Inter", "normal");
    doc.text("District", 100, startY + 102);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.district), 100, startY + 108);

    // Bank Details Section
    doc.setFontSize(16);
    doc.setFont("Inter", "bold");
    doc.text("Bank Details", 14, startY + 120);

    doc.setFontSize(12);
    doc.setFont("Inter", "normal");

    // Account Holder Name
    doc.text("Account Holder's Name", 14, startY + 130);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.accHolderName), 14, startY + 136);

    // Account Number
    doc.setFont("Inter", "normal");
    doc.text("Account Number", 100, startY + 130);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.accNumber), 100, startY + 136);

    // Bank Name
    doc.setFont("Inter", "normal");
    doc.text("Bank Name", 14, startY + 146);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.bankName), 14, startY + 152);

    // Branch Name
    doc.setFont("Inter", "normal");
    doc.text("Branch Name", 100, startY + 146);
    doc.setFont("Inter", "bold");
    doc.text(getValueOrNA(this.officerObj.branchName), 100, startY + 152);

    // Save PDF
    doc.save(`Personal_Details_${getValueOrNA(this.officerObj.firstNameEnglish)}.pdf`);
}

  toggleDisclaimView() {
    this.showDisclaimView = !this.showDisclaimView; // Toggle the boolean value
  }

  viewOfficerTarget(officerId: number) {
    this.router.navigate([`/manage-officers/view-officer-target/${officerId}`])
  }

  cancelDisclaim() {
    this.showDisclaimView = false;
    this.router.navigate(['/manage-officers']);
  }

  confirmDisclaim(id: number) {
    this.isLoading = true;

    this.ManageOficerSrv.disclaimOfficer(id).subscribe(
      (response) => {
        
        this.isLoading = false;
        this.showDisclaimView = false;
        this.router.navigate(['/manage-officers']);
        this.toastSrv.success('Officer ID sent successfully!');
      },
      (error) => {
        console.error('Error sending Officer ID:', error);
        this.isLoading = false;
        this.toastSrv.error('Failed to send Officer ID!');
        this.router.navigate(['/manage-officers']);
      }
    );

  }

  private setActiveTabFromRoute(): void {
    const currentPath = this.router.url.split('?')[0];
    // Extract the first segment after the initial slash
    this.naviPath = currentPath.split('/')[1];   
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




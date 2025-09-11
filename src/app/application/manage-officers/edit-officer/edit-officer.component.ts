import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Country, COUNTRIES } from '../../../../assets/country-data';

@Component({
  selector: 'app-edit-officer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './edit-officer.component.html',
  styleUrl: './edit-officer.component.css'
})
export class EditOfficerComponent implements OnInit {
  personalData: Personal = new Personal();
  centerArr: Center[] = [];
  managerArr: Manager[] = [];
  driverObj: Drivers = new Drivers()

  languagesRequired: boolean = false;


  languages: string[] = ['Sinhala', 'English', 'Tamil'];
  selectedPage: 'pageOne' | 'pageTwo' | 'pageThree' = 'pageOne';
  lastID!: number
  itemId: number | null = null;
  officerId!: number
  editOfficerId!: number
  selectJobRole!: string
  UpdatelastID!: string
  upateEmpID!: string
  selectedLanguages: string[] = [];

  centerId!: number;

  previousJobRole!: string;

  selectedFileName!: string
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  logingRole: string | null = null;
  ExistirmId!: number;
  isLoading: boolean = true;

  banks: Bank[] = [];
  branches: Branch[] = [];
  selectedBankId: number | null = null;
  selectedBranchId: number | null = null;
  allBranches: BranchesData = {};

  invalidFields: Set<string> = new Set();
  naviPath!: string

  selectVehicletype: any = { name: '', capacity: '' };

  countries: Country[] = COUNTRIES;
  selectedCountry1: Country | null = null;
  selectedCountry2: Country | null = null;

  dropdownOpen = false;
  dropdownOpen2 = false;

  allowedPrefixes = ['70', '71', '72', '75', '76', '77', '78'];
  isPhoneInvalidMap: { [key: string]: boolean } = {
  phone01: false,
  phone02: false,
};


  licenseFrontImageFileName!: string;
  licenseFrontImagePreview: string | ArrayBuffer | null = null;
  licenseFrontImageFile: File | null = null;

  licenseBackImageFileName!: string;
  licenseBackImagePreview: string | ArrayBuffer | null = null;
  licenseBackImageFile: File | null = null;

  insurenceFrontImageFileName!: string;
  insurenceFrontImagePreview: string | ArrayBuffer | null = null;
  insurenceFrontImageFile: File | null = null;

  insurenceBackImageFileName!: string;
  insurenceBackImagePreview: string | ArrayBuffer | null = null;
  insurenceBackImageFile: File | null = null;

  vehicleFrontImageFileName!: string;
  vehicleFrontImagePreview: string | ArrayBuffer | null = null;
  vehicleFrontImageFile: File | null = null;

  vehicleBackImageFileName!: string;
  vehicleBackImagePreview: string | ArrayBuffer | null = null;
  vehicleBackImageFile: File | null = null;

  vehicleSideAImageFileName!: string;
  vehicleSideAImagePreview: string | ArrayBuffer | null = null;
  vehicleSideAImageFile: File | null = null;

  vehicleSideBImageFileName!: string;
  vehicleSideBImagePreview: string | ArrayBuffer | null = null;
  vehicleSideBImageFile: File | null = null;



  constructor(
    private ManageOficerSrv: ManageOfficersService,
    private router: Router,
    private route: ActivatedRoute,
    private toastSrv: ToastAlertService,
    private tokenSrv: TokenServiceService,
    private http: HttpClient,
    private location: Location

  ) {
    this.logingRole = tokenSrv.getUserDetails().role
    const defaultCountry = this.countries.find(c => c.code === 'lk') || null;
    this.selectedCountry1 = defaultCountry;
    this.selectedCountry2 = defaultCountry;

  }

  districts = [
    { name: 'Ampara', province: 'Eastern' },
    { name: 'Anuradhapura', province: 'North Central' },
    { name: 'Badulla', province: 'Uva' },
    { name: 'Batticaloa', province: 'Eastern' },
    { name: 'Colombo', province: 'Western' },
    { name: 'Galle', province: 'Southern' },
    { name: 'Gampaha', province: 'Western' },
    { name: 'Hambantota', province: 'Southern' },
    { name: 'Jaffna', province: 'Northern' },
    { name: 'Kalutara', province: 'Western' },
    { name: 'Kandy', province: 'Central' },
    { name: 'Kegalle', province: 'Sabaragamuwa' },
    { name: 'Kilinochchi', province: 'Northern' },
    { name: 'Kurunegala', province: 'North Western' },
    { name: 'Mannar', province: 'Northern' },
    { name: 'Matale', province: 'Central' },
    { name: 'Matara', province: 'Southern' },
    { name: 'Monaragala', province: 'Uva' },
    { name: 'Mullaitivu', province: 'Northern' },
    { name: 'Nuwara Eliya', province: 'Central' },
    { name: 'Polonnaruwa', province: 'North Central' },
    { name: 'Puttalam', province: 'North Western' },
    { name: 'Rathnapura', province: 'Sabaragamuwa' },
    { name: 'Trincomalee', province: 'Eastern' },
    { name: 'Vavuniya', province: 'Northern' },
  ];

  VehicleTypes = [
    { name: 'Lorry', capacity: 2 },
    { name: 'Dimo Batta', capacity: 3.5 },
    { name: 'Van', capacity: 2.5 },
    { name: 'Cab', capacity: 0.5 },
  ]


  ngOnInit(): void {
    // this.getAllCollectionCetnter();
    this.loadBanks();
    this.loadBranches();
    this.getAllCenters();
    this.editOfficerId = this.route.snapshot.params['id'];
    this.centerId = this.route.snapshot.params['centerId'];
    this.fetchOffierById(this.editOfficerId);
    // this.UpdateEpmloyeIdCreate();
    this.setActiveTabFromRoute()
  }

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: HTMLElement) {
    const insideDropdown1 = targetElement.closest('.dropdown-wrapper-1');
    const insideDropdown2 = targetElement.closest('.dropdown-wrapper-2');
  
    // Close dropdowns only if click is outside their wrapper
    if (!insideDropdown1) {
      this.dropdownOpen = false;
    }
    if (!insideDropdown2) {
      this.dropdownOpen2 = false;
    }
  }

  fetchOffierById(id: number) {
    this.isLoading = true;
    this.ManageOficerSrv.getOfficerById(id).subscribe(
      (res: any) => {

        this.personalData = res.officerData.collectionOfficer;
        this.personalData.previousJobRole = res.officerData.collectionOfficer.jobRole;
        this.personalData.conformAccNumber = this.personalData.accNumber
        
        console.log(this.personalData);
        this.ExistirmId = res.officerData.irmId;

        // this.getUpdateLastID(res.officerData.collectionOfficer.jobRole);
        this.driverObj = res.officerData.driver;
        this.driverObj.insExpDate = this.formatDateForInput(this.driverObj.insExpDate);
        this.selectVehicletype = this.VehicleTypes.find(
          (v) => v.name === this.driverObj.vType && v.capacity === this.driverObj.vCapacity
        );
        this.personalData.previousQR = this.personalData.QRcode;
        this.personalData.previousImage = this.personalData.image;


        // Initialize languages as a comma-separated string if it's not already in that format
        if (Array.isArray(this.personalData.languages)) {
          this.personalData.languages = this.personalData.languages.join(',');
        } else if (!this.personalData.languages) {
          this.personalData.languages = '';
        }

        this.selectJobRole = res.officerData.collectionOfficer.jobRole;
        this.getAllManagers();


        // this.UpdateEpmloyeIdCreate();
        this.matchExistingBankToDropdown();
        this.isLoading = false;

      }
    );
  }

  formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  selectCountry1(country: Country) {
    this.selectedCountry1 = country;
    this.personalData.phoneCode01 = country.dialCode; // update ngModel
    console.log('sdsf', this.personalData.phoneCode01)
    this.dropdownOpen = false;
  }

  selectCountry2(country: Country) {
    this.selectedCountry2 = country;
    this.personalData.phoneCode01 = country.dialCode; // update ngModel
    console.log('sdsf', this.personalData.phoneCode01)
    this.dropdownOpen2 = false;
  }
  
  // get flag
  getFlagUrl(code: string): string {
    return `https://flagcdn.com/24x18/${code}.png`;
  }

  validateSriLankanPhone(input: string, key: string): void {
    if (!input) {
      this.isPhoneInvalidMap[key] = false;
      return;
    }
  
    const firstDigit = input.charAt(0);
    const prefix = input.substring(0, 2);
    const isValidPrefix = this.allowedPrefixes.includes(prefix);
    const isValidLength = input.length === 9;
  
    if (firstDigit !== '7') {
      this.isPhoneInvalidMap[key] = true;
      return;
    }
  
    if (!isValidPrefix && input.length >= 2) {
      this.isPhoneInvalidMap[key] = true;
      return;
    }
  
    if (input.length === 9 && isValidPrefix) {
      this.isPhoneInvalidMap[key] = false;
      return;
    }
  
    this.isPhoneInvalidMap[key] = false;
  }


  private setActiveTabFromRoute(): void {
    const currentPath = this.router.url.split('?')[0];
    // Extract the first segment after the initial slash
    this.naviPath = currentPath.split('/')[1];
  }


  // getUpdateLastID(role: string): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     this.ManageOficerSrv.getForCreateId(role).subscribe(
  //       (res) => {
  //         let lastId;
  //         if (this.selectJobRole === this.personalData.jobRole) {
  //           lastId = this.personalData.empId;
  //           this.UpdatelastID = lastId;


  //         } else {
  //           this.UpdatelastID = res.result.empId;
  //           lastId = res.result.empId


  //         }
  //         ;
  //         resolve(lastId); // Resolve the Promise with the empId
  //       },
  //       (error) => {
  //         console.error('Error fetching last ID:', error);
  //         reject(error);
  //       }
  //     );
  //   });
  // }


  // UpdateEpmloyeIdCreate() {
  //   let rolePrefix: string | undefined;

  //   // Map job roles to their respective prefixes
  //   if (this.personalData.jobRole === 'Collection Center Manager') {
  //     rolePrefix = 'CCM';
  //   } else if (this.personalData.jobRole === 'Customer Officer') {
  //     rolePrefix = 'CUO';
  //   } else if (this.personalData.jobRole === 'Driver') {
  //     rolePrefix = 'DVR';
  //   } else {
  //     rolePrefix = 'COO';

  //   }


  //   if (!rolePrefix) {
  //     console.error(`Invalid job role: ${this.personalData.jobRole}`);
  //     return;
  //   }


  //   this.getUpdateLastID(rolePrefix)
  //     .then((lastId) => {
  //       this.upateEmpID = rolePrefix + lastId;

  //     })
  //     .catch((error) => {
  //       console.error('Error fetching updated last ID:', error);
  //     });
  // }


  onCheckboxChange(lang: string, event: any) {
    if (event.target.checked) {
      if (this.personalData.languages) {
        if (!this.personalData.languages.includes(lang)) {
          this.personalData.languages += this.personalData.languages ? `,${lang}` : lang;
        }
      } else {
        this.personalData.languages = lang;
      }
    } else {
      const languagesArray = this.personalData.languages.split(',');
      const index = languagesArray.indexOf(lang);
      if (index !== -1) {
        languagesArray.splice(index, 1);
      }
      this.personalData.languages = languagesArray.join(',');
    }

    this.validateLanguages();
  }

  validateLanguages() {
    this.languagesRequired = !this.personalData.languages || this.personalData.languages.trim() === '';
    console.log('language', this.languagesRequired)
  }


  nextForm(page: 'pageOne' | 'pageTwo' | 'pageThree') {

    this.selectedPage = page;


  }

  triggerFileInput(event: Event): void {
    event.preventDefault();
    const fileInput = document.getElementById('imageUpload');
    fileInput?.click();
  }


  onFileSelected(event: any): void {
    this.imageLoadError = false; // Reset error state when new file is selected
    const file: File = event.target.files[0];

    if (file) {
      if (file.size > 5000000) {
        this.toastSrv.error('File size should not exceed 5MB');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.toastSrv.error('Only JPEG, JPG and PNG files are allowed');
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
        // Clear any previous image error
        this.imageLoadError = false;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProvince(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedDistrict = target.value;

    const selected = this.districts.find(district => district.name === selectedDistrict);

    if (this.itemId === null) {

      if (selected) {
        this.personalData.province = selected.province;
      } else {
        this.personalData.province = '';
      }

    }

  }


  onSubmit() {

    this.personalData.empId = this.upateEmpID;

    if (this.personalData.accNumber !== this.personalData.conformAccNumber) {
      return;
    }

    if (this.personalData.phoneNumber01 == this.personalData.phoneNumber02) {
      this.toastSrv.warning('Pleace enter 2 different phone numbers')
   }

    else if (!this.personalData.accHolderName || !this.personalData.accNumber || !this.personalData.bankName || !this.personalData.branchName || !this.personalData.city || !this.personalData.country || !this.personalData.district || !this.personalData.houseNumber) {
      this.toastSrv.warning('Pleace fill all required feilds')

    } else {
      this.isLoading = true;

      if (this.logingRole === 'Collection Center Manager') {
        this.ManageOficerSrv.updateCollectiveOfficer(this.personalData, this.editOfficerId, this.selectedImage).subscribe(
          (res: any) => {
            this.officerId = res.officerId;
            this.isLoading = false;
            if (res && res.message) {
              // Success response from backend
              this.toastSrv.success(res.message);
              this.location.back();
            } else {
              // Handle unexpected format
              this.toastSrv.error('Something went wrong while updating.');
            }

          },
          (error: any) => {
            this.isLoading = false;
            if (error.status === 409) {
              this.toastSrv.error('NIC already exists for another collection officer');
            } else if (error.status === 410) {
              this.toastSrv.error('Email already exists for another collection officer');
            } else if (error.status === 411) {
              this.toastSrv.error('Mobile Number 01 already exists for another collection officer');
            } else if (error.status === 412) {
              this.toastSrv.error('Mobile Number 02 already exists for another collection officer');
            } else if (error.status === 400) {
              this.toastSrv.error('No file uploaded. Please attach required file(s).');
            } else if (error.status === 500) {
              this.toastSrv.error('Internal server error. Please try again later.');
            } else {
              this.toastSrv.error('An unexpected error occurred.');
            }

          }
        );
      } else if (this.logingRole === 'Collection Center Head') {
        if (this.personalData.jobRole === 'Collection Center Manager') {
          this.personalData.irmId = null;
        }

        if (this.personalData.jobRole === 'Driver') {

          this.driverObj.licFrontName = this.licenseFrontImageFileName
          this.driverObj.licBackName = this.licenseBackImageFileName
          this.driverObj.insFrontName = this.insurenceFrontImageFileName
          this.driverObj.insBackName = this.insurenceBackImageFileName
          this.driverObj.vFrontName = this.vehicleFrontImageFileName
          this.driverObj.vBackName = this.vehicleBackImageFileName
          this.driverObj.vSideAName = this.vehicleSideAImageFileName
          this.driverObj.vSideBName = this.vehicleSideBImageFileName
        }

        this.ManageOficerSrv.CCHupdateCollectiveOfficer(this.personalData, this.editOfficerId, this.selectedImage, this.driverObj, this.licenseFrontImagePreview, this.licenseBackImagePreview, this.insurenceFrontImagePreview, this.insurenceBackImagePreview, this.vehicleFrontImagePreview, this.vehicleBackImagePreview, this.vehicleSideAImagePreview, this.vehicleSideBImagePreview).subscribe(
          (res: any) => {
            this.isLoading = false;

            if (res && res.message) {
              // Success response from backend
              this.toastSrv.success(res.message);
              this.location.back();
            } else {
              // Handle unexpected format
              this.toastSrv.error('Something went wrong while updating.');
            }
          },
          (error: any) => {
            this.isLoading = false;

            if (error.status === 409) {
              this.toastSrv.error('NIC already exists for another collection officer');
            } else if (error.status === 410) {
              this.toastSrv.error('Email already exists for another collection officer');
            } else if (error.status === 411) {
              this.toastSrv.error('Mobile Number 01 already exists for another collection officer');
            } else if (error.status === 412) {
              this.toastSrv.error('Mobile Number 02 already exists for another collection officer');
            }else if (error.status === 400) {
              this.toastSrv.error('No file uploaded. Please attach required file(s).');
            } else if (error.status === 500) {
              this.toastSrv.error('Internal server error. Please try again later.');
            } else {
              this.toastSrv.error('An unexpected error occurred.');
            }
          }


        );
      }



    }
  }

  onCancel() {
    Swal.fire({
      title: 'You have unsaved changes',
      text: 'If you leave this page now, your changes will be lost.<br>Do you want to continue without saving?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Cancel it!',
      cancelButtonText: 'No, Stay On Page',
      customClass: {
        popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
        title: 'dark:text-white',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.toastSrv.warning('Officer Edit Canceled.')
        this.location.back();

      }
    });
  }


  getAllCenters() {
    this.ManageOficerSrv.getCCHOwnCenters().subscribe(
      (res) => {
        this.centerArr = res

      }
    )
  }

  getAllManagers() {
    this.ManageOficerSrv.getCenterManagers(this.personalData.centerId).subscribe(
      (res) => {

        this.managerArr = res

      }
    )
  }

  checkManager() {
    if (!this.personalData.centerId) {
      this.toastSrv.warning('Pleace select center before select manager')
      this.personalData.irmId = ''
      return;
    }
  }

  loadBanks() {
    this.http.get<Bank[]>('assets/json/banks.json').subscribe(
      data => {
        this.banks = data.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
      },
      error => {
        console.error('Error loading banks:', error);
      }
    );
  }


  loadBranches() {
    this.http.get<BranchesData>('assets/json/branches.json').subscribe(
      data => {
        Object.keys(data).forEach(bankID => {
          data[bankID].sort((a, b) => a.name.localeCompare(b.name));
        });
        this.allBranches = data;
      },
      error => {
        console.error('Error loading branches:', error);
      }
    );
  }



  matchExistingBankToDropdown() {

    // Only proceed if both banks and branches are loaded and we have existing data
    if (this.banks.length > 0 && Object.keys(this.allBranches).length > 0 &&
      this.personalData && this.personalData.bankName) {

      // Find the bank ID that matches the existing bank name
      const matchedBank = this.banks.find(bank => bank.name === this.personalData.bankName);

      if (matchedBank) {
        this.selectedBankId = matchedBank.ID;
        // Load branches for this bank
        this.branches = this.allBranches[this.selectedBankId.toString()] || [];

        // If we also have a branch name, try to match it
        if (this.personalData.branchName) {
          const matchedBranch = this.branches.find(branch => branch.name === this.personalData.branchName);
          if (matchedBranch) {
            this.selectedBranchId = matchedBranch.ID;
          }
        }
      }
    }

  }


  onBankChange() {
    if (this.selectedBankId) {
      // Update branches based on selected bank
      this.branches = this.allBranches[this.selectedBankId.toString()] || [];

      // Update company data with bank name
      const selectedBank = this.banks.find(bank => bank.ID === this.selectedBankId);
      if (selectedBank) {
        this.personalData.bankName = selectedBank.name;
      }

      // Reset branch selection if the current selection doesn't belong to this bank
      const currentBranch = this.branches.find(branch => branch.ID === this.selectedBranchId);
      if (!currentBranch) {
        this.selectedBranchId = null;
        this.personalData.branchName = '';
      }
    } else {
      this.branches = [];
      this.personalData.bankName = '';
    }
  }

  onBranchChange() {
    if (this.selectedBranchId) {
      // Update company data with branch name
      const selectedBranch = this.branches.find(branch => branch.ID === this.selectedBranchId);
      if (selectedBranch) {
        this.personalData.branchName = selectedBranch.name;
      }
    } else {
      this.personalData.branchName = '';
    }
  }

  imageLoadError = false;

  handleImageError() {
    this.imageLoadError = true;
    this.personalData.image = ''; // Clear the invalid image URL
  }

  onSubmitForm(form: NgForm) {
    form.form.markAllAsTouched();

    this.validateLanguages();
  }

  onLicenseFrontImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5000000) {
        this.toastSrv.error('License image size should not exceed 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.toastSrv.error('License image must be JPEG, JPG or PNG format');
        return;
      }

      this.licenseFrontImageFile = file;
      this.licenseFrontImageFileName = file.name;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.licenseFrontImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Clear license image
  clearLicenseFrontImage(): void {
    this.licenseFrontImageFile = null;
    this.licenseFrontImageFileName = '';
    this.licenseFrontImagePreview = null;
    const fileInput = document.getElementById('licenseFrontImageUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  triggerFileInputForDriver(event: Event, inputId: string): void {
    event.preventDefault();
    const fileInput = document.getElementById(inputId);
    fileInput?.click();
  }

  onLicenseBackImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5000000) {
        this.toastSrv.error('License image size should not exceed 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.toastSrv.error('License image must be JPEG, JPG or PNG format');
        return;
      }

      this.licenseBackImageFile = file;
      this.licenseBackImageFileName = file.name;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.licenseBackImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Clear license image
  clearLicenseBackImage(): void {
    this.licenseBackImageFile = null;
    this.licenseBackImageFileName = '';
    this.licenseBackImagePreview = null;
    const fileInput = document.getElementById('licenseBackImageUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onInsurenceFrontImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5000000) {
        this.toastSrv.error('Insurence image size should not exceed 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.toastSrv.error('Insurence image must be JPEG, JPG or PNG format');
        return;
      }

      this.insurenceFrontImageFile = file;
      this.insurenceFrontImageFileName = file.name;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.insurenceFrontImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Clear license image
  clearInsurenceFrontImage(): void {
    this.insurenceFrontImageFile = null;
    this.insurenceFrontImageFileName = '';
    this.insurenceFrontImagePreview = null;
    const fileInput = document.getElementById('insurenceFrontImageUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }


  onInsurenceBackImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5000000) {
        this.toastSrv.error('Insurence image size should not exceed 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.toastSrv.error('Insurence image must be JPEG, JPG or PNG format');
        return;
      }

      this.insurenceBackImageFile = file;
      this.insurenceBackImageFileName = file.name;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.insurenceBackImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Clear license image
  clearInsurenceBackImage(): void {
    this.insurenceBackImageFile = null;
    this.insurenceBackImageFileName = '';
    this.insurenceBackImagePreview = null;
    const fileInput = document.getElementById('insuranceBackImageUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }


  onVehicleFrontImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5000000) {
        this.toastSrv.error('License image size should not exceed 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.toastSrv.error('License image must be JPEG, JPG or PNG format');
        return;
      }

      this.vehicleFrontImageFile = file;
      this.vehicleFrontImageFileName = file.name;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.vehicleFrontImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Clear license image
  clearVehicleFrontImage(): void {
    this.vehicleFrontImageFile = null;
    this.vehicleFrontImageFileName = '';
    this.vehicleFrontImagePreview = null;
    const fileInput = document.getElementById('vehicleFrontImageUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }


  onVehicleBackImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5000000) {
        this.toastSrv.error('Vehicle Back image size should not exceed 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.toastSrv.error('Vehicle Back image must be JPEG, JPG or PNG format');
        return;
      }

      this.vehicleBackImageFile = file;
      this.vehicleBackImageFileName = file.name;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.vehicleBackImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Clear license image
  clearVehicleBackImage(): void {
    this.vehicleBackImageFile = null;
    this.vehicleBackImageFileName = '';
    this.vehicleBackImagePreview = null;
    const fileInput = document.getElementById('vehicleBackImageUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onVehicleSideAImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5000000) {
        this.toastSrv.error('Vehicle Back image size should not exceed 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.toastSrv.error('Vehicle Back image must be JPEG, JPG or PNG format');
        return;
      }

      this.vehicleSideAImageFile = file;
      this.vehicleSideAImageFileName = file.name;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.vehicleSideAImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Clear license image
  clearVehicleSideAImage(): void {
    this.vehicleSideAImageFile = null;
    this.vehicleSideAImageFileName = '';
    this.vehicleSideAImagePreview = null;
    const fileInput = document.getElementById('vehicleSideAImageUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }



  onVehicleSideBImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5000000) {
        this.toastSrv.error('Vehicle Back image size should not exceed 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.toastSrv.error('Vehicle Back image must be JPEG, JPG or PNG format');
        return;
      }

      this.vehicleSideBImageFile = file;
      this.vehicleSideBImageFileName = file.name;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.vehicleSideBImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Clear license image
  clearVehicleSideBImage(): void {
    this.vehicleSideBImageFile = null;
    this.vehicleSideBImageFileName = '';
    this.vehicleSideBImagePreview = null;
    const fileInput = document.getElementById('vehicleSideBImageUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  vehicleChange() {
    this.driverObj.vType = this.selectVehicletype.name
    this.driverObj.vCapacity = this.selectVehicletype.capacity
  }

  navigateToCenters() {
    this.router.navigate(['/centers']); // Change '/reports' to your desired route
  }

  navigateToCenterDashboard() {
    this.router.navigate(['/centers/center-shashbord', this.centerId]); // Change '/reports' to your desired route
  }

  blockSpecialChars(event: KeyboardEvent) {
    // Allow letters (A-Z, a-z), space, backspace, delete, arrow keys
    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '
    ];
  
    // Regex: Only allow alphabets and spaces
    const regex = /^[a-zA-Z\s]*$/;
  
    // Block if key is not allowed
    if (!allowedKeys.includes(event.key) && !regex.test(event.key)) {
      event.preventDefault();
    }
  }

  capitalizeFirstLetter(field: keyof typeof this.personalData) {
    if (this.personalData[field]) {
      // Trim spaces
      this.personalData[field] = this.personalData[field].trim();
  
      // Capitalize first letter
      this.personalData[field] =
        this.personalData[field].charAt(0).toUpperCase() +
        this.personalData[field].slice(1);
    }
  }

  onTrimInput(event: Event, modelRef: any, fieldName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const trimmedValue = inputElement.value.trimStart();
    modelRef[fieldName] = trimmedValue;
    inputElement.value = trimmedValue;
  }




}




class Personal {
  firstNameEnglish!: string;
  firstNameSinhala!: string;
  firstNameTamil!: string;
  lastNameEnglish!: string;
  lastNameSinhala!: string;
  lastNameTamil!: string;
  phoneCode01: string = '+94';
  phoneNumber01!: string;
  phoneCode02: string = '+94';
  phoneNumber02!: string;
  nic!: string;
  email!: string;
  houseNumber!: string;
  streetName!: string;
  city!: string;
  district!: string;
  province!: string;
  country: string = 'Sri Lanka';
  languages: string = '';
  QRcode!: string;

  accHolderName!: string;
  accNumber!: string;
  bankName!: string;
  branchName!: string;
  conformAccNumber!: string;

  jobRole: string = 'Collection Officer'
  empId!: string
  employeeType!: string;

  image!: any

  previousQR!: string
  previousImage!: string


  centerId: number | string = '';
  irmId: number | string | null = '';
  previousJobRole!: string;

}


class Center {
  id!: number
  centerName!: string
}

class Manager {
  id!: number;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
}


interface Bank {
  ID: number;
  name: string;
}

interface Branch {
  bankID: number;
  ID: number;
  name: string;
}



interface BranchesData {
  [key: string]: Branch[];
}

class Drivers {
  vehicleRegId!: number;
  licNo!: string;
  insNo!: string;
  insExpDate!: string;
  vType!: string;
  vCapacity!: number;
  vRegNo!: string;

  licFrontName!: string;
  licBackName!: string;
  insFrontName!: string;
  insBackName!: string;
  vFrontName!: string;
  vBackName!: string;
  vSideAName!: string;
  vSideBName!: string;

  licFrontImg!: string;
  licBackImg!: string;
  insFrontImg!: string;
  insBackImg!: string;
  vehFrontImg!: string;
  vehBackImg!: string;
  vehSideImgA!: string;
  vehSideImgB!: string;
}





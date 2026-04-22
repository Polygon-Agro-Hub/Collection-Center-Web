import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ElementRef, ViewChild } from '@angular/core';
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
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';

@Component({
  selector: 'app-edit-officer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingSpinnerComponent, SerchableDropdownComponent],
  templateUrl: './edit-officer.component.html',
  styleUrl: './edit-officer.component.css'
})
export class EditOfficerComponent implements OnInit {
  @ViewChild('scrollTarget') scrollTarget!: ElementRef;
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

  isPopupVisible: boolean = false;

  banks: Bank[] = [];
  branches: Branch[] = [];
  selectedBankId: number | null = null;
  selectedBranchId: number | null = null;
  allBranches: BranchesData = {};

  bankItems: { value: number; label: string }[] = [];
  branchItems: { value: number; label: string }[] = [];

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

  filteredCenterArr: Center[] = [];
  filteredManagerArr: Manager[] = [];

  centreDropdownOpen = false;
  selectedCenterName: string = "";
  selectedManager: string = "";
  managerDropdownOpen = false;

  selectedManagerName: string = "";

  isJobRoleOpen = false;

  jobRoles: string[] = [];

  jobRoleInputTouched = false;


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

  districtItems = this.districts.map(d => ({ value: d.name, label: d.name }));

  VehicleTypes = [
    { name: 'Mahindra Bollero', capacity: 272},
    { name: 'Dimo Batta', capacity: 750 },
    { name: 'Three Wheeler', capacity: 100 },
  ]


  ngOnInit(): void {
    // this.getAllCollectionCetnter();
    this.loadBanks();
    this.loadBranches();
    this.getAllCenters();
    this.editOfficerId = this.route.snapshot.params['id'];
    this.centerId = this.route.snapshot.params['centerId'];
    this.fetchOffierById(this.editOfficerId);

    this.setJobRoles();
    // this.UpdateEpmloyeIdCreate();
    this.setActiveTabFromRoute()
  }

  // @HostListener('document:click', ['$event.target'])
  // onClick(targetElement: HTMLElement) {
  //   const insideDropdown1 = targetElement.closest('.dropdown-wrapper-1');
  //   const insideDropdown2 = targetElement.closest('.dropdown-wrapper-2');
  
  //   // Close dropdowns only if click is outside their wrapper
  //   if (!insideDropdown1) {
  //     this.dropdownOpen = false;
  //   }
  //   if (!insideDropdown2) {
  //     this.dropdownOpen2 = false;
  //   }
  // }

  setJobRoles() {
    if (this.logingRole === 'Collection Centre Manager') {
      // Only allow Collection Officer
      this.jobRoles = ['Collection Officer'];
    } 
    else if (this.logingRole === 'Collection Centre Head') {
      // Allow all roles
      this.jobRoles = [
        'Collection Centre Manager',
        'Collection Officer'
      ];
    } 
    else {
      // Default (if needed)
      this.jobRoles = [];
    }
  }

  toggleJobRoleDropdown() {
    this.isJobRoleOpen = !this.isJobRoleOpen;

    this.jobRoleInputTouched = true;

    console.log('jobRoleInputTouched', this.jobRoleInputTouched)
  }

  getJobRole(role: string) {
    this.personalData.jobRole = role;
    this.isJobRoleOpen = false;
    this.jobRoleInputTouched = true;

    console.log('jobRoleInputTouched', this.jobRoleInputTouched)
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.toLowerCase();
    console.log('value', value);
  
    this.filteredCenterArr = this.centerArr.filter(c =>
      (c.centerName || '').toLowerCase().includes(value)
    );
  
    console.log('filtered centers', this.filteredCenterArr);
  
  }
  
  
  
  toggleDropdown() {
    this.centreDropdownOpen = !this.centreDropdownOpen;
  }
  
  toggleManagerDropdown() {
    this.managerDropdownOpen = !this.managerDropdownOpen;
  }
  
  selectCenter(item: Center) {
    console.log('center selected');
  
    this.personalData.centerId = item.id;
    this.selectedCenterName = item.centerName;
    this.centreDropdownOpen = false; // close dropdown
  
    // Reset search input and filtered array
    this.filteredCenterArr = [...this.centerArr]; // show full list next time
    const searchInput = document.querySelector<HTMLInputElement>('.dropdown-search-input');
    if (searchInput) {
      searchInput.value = '';
    }
  
    this.changeCenter();
  }

  changeCenter() {
    this.personalData.jobRole = ''
    this.personalData.irmId = null
    this.selectedManager = ''
   this.getAllManagers()
 }
  
  onManagerSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.toLowerCase().trim(); // remove leading/trailing spaces
    console.log('search value', value);
  
    this.filteredManagerArr = this.managerArr.filter(m => {
      const fullName = `${m.firstNameEnglish} ${m.lastNameEnglish}`.toLowerCase();
      return fullName.includes(value);
    });
  
    console.log('filtered managers', this.filteredManagerArr);
  }
  
  
  selectManager(item: Manager) {
    console.log('Manager selected');
  
    this.personalData.irmId = item.id;
    this.selectedManager = item.firstNameEnglish + ' ' + item.lastNameEnglish;
    console.log('name', item.firstNameEnglish )
    this.managerDropdownOpen = false; // close dropdown
  
    // Reset search input and filtered array
    this.filteredManagerArr = [...this.managerArr]; // show full list next time
    const searchInput = document.querySelector<HTMLInputElement>('.dropdown-manager-search-input');
    if (searchInput) {
      searchInput.value = '';
    }
  
    console.log('id', this.personalData.irmId)
  
    // this.changeCenter();
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

        this.selectedCenterName = res.officerData.collectionOfficer.centerName
        if (res.officerData.collectionOfficer.irmId) {
          this.selectedManager = res.managerName.firstNameEnglish + ' ' + res.managerName.lastNameEnglish
        } else {
          this.selectedManager = ''
        }

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
  
    // if (firstDigit !== '7') {
    //   this.isPhoneInvalidMap[key] = true;
    //   return;
    // }
  
    // if (!isValidPrefix && input.length >= 2) {
    //   this.isPhoneInvalidMap[key] = true;
    //   return;
    // }
  
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
    this.scrollToTop();
  }

  scrollToTop() {
    if (this.scrollTarget) {
      this.scrollTarget.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      if (file.size > 3 * 1024 * 1024) {
        this.toastSrv.error('File size should not exceed 3MB');
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

  onDistrictChange(districtName: string | null) {
    if (this.itemId !== null) return; // keep your original guard

    const selected = this.districts.find(d => d.name === districtName || '');
    this.personalData.province = selected ? selected.province : '';
  }


  onSubmit() {

    console.log('personal data', this.personalData)

    this.personalData.empId = this.upateEmpID;

    if (this.personalData.accNumber !== this.personalData.conformAccNumber) {
      return;
    }

    if (this.personalData.phoneNumber01 == this.personalData.phoneNumber02) {
      this.toastSrv.warning('Pleace enter 2 different Mobile numbers')
   }

    else if (!this.personalData.accHolderName || !this.personalData.accNumber || !this.personalData.bankName || !this.personalData.branchName || !this.personalData.city || !this.personalData.country || !this.personalData.district || !this.personalData.houseNumber) {
      this.toastSrv.warning('Pleace fill all required feilds')

    } else {
      this.isLoading = true;

      if (this.logingRole === 'Collection Centre Manager') {
        this.ManageOficerSrv.updateCollectiveOfficer(this.personalData, this.editOfficerId, this.selectedFile).subscribe(
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
            let errorMessage = 'An unexpected error occurred';
            let messages: string[] = [];

            if (error.error && Array.isArray(error.error.errors)) {
              messages = error.error.errors.map((err: string) => {
                switch (err) {
                  case 'NIC':
                    return 'The NIC number is already registered.';
                  case 'Email':
                    return 'Email already exists.';
                  case 'PhoneNumber01':
                    return 'Mobile Number 1 already exists.';
                  case 'PhoneNumber02':
                    return 'Mobile Number 2 already exists.';
                  default:
                    return 'Validation error: ' + err;
                }
              });
            }

            if (messages.length > 0) {
              errorMessage = '<div class="text-left"><p class="mb-2">Please fix the following Duplicate field issues:</p><ul class="list-disc pl-5">';
              messages.forEach(m => {
                errorMessage += `<li>${m}</li>`;
              });
              errorMessage += '</ul></div>';

              Swal.fire({
                icon: 'error',
                title: 'Duplicate Information',
                html: errorMessage,
                confirmButtonText: 'OK',
                customClass: {
                  popup: 'bg-tileLight dark:bg-[#363636] text-black dark:text-white',
                  title: 'font-semibold text-lg',
                  htmlContainer: 'text-left',
                  confirmButton: 'bg-red-500 dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-700',
                },
              });
              return;
            }
          }
        );
      } else if (this.logingRole === 'Collection Centre Head') {
        if (this.personalData.jobRole === 'Collection Centre Manager') {
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

        this.ManageOficerSrv.CCHupdateCollectiveOfficer(this.personalData, this.editOfficerId, this.selectedFile, this.driverObj, this.licenseFrontImagePreview, this.licenseBackImagePreview, this.insurenceFrontImagePreview, this.insurenceBackImagePreview, this.vehicleFrontImagePreview, this.vehicleBackImagePreview, this.vehicleSideAImagePreview, this.vehicleSideBImagePreview).subscribe(
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
            let errorMessage = 'An unexpected error occurred';
            let messages: string[] = [];

            if (error.error && Array.isArray(error.error.errors)) {
              messages = error.error.errors.map((err: string) => {
                switch (err) {
                  case 'NIC':
                    return 'The NIC number is already registered.';
                  case 'Email':
                    return 'Email already exists.';
                  case 'PhoneNumber01':
                    return 'Mobile Number 01 already exists.';
                  case 'PhoneNumber02':
                    return 'Mobile Number 02 already exists.';
                  default:
                    return 'Validation error: ' + err;
                }
              });
            }

            if (messages.length > 0) {
              errorMessage = '<div class="text-left"><p class="mb-2">Please fix the following Duplicate field issues:</p><ul class="list-disc pl-5">';
              messages.forEach(m => {
                errorMessage += `<li>${m}</li>`;
              });
              errorMessage += '</ul></div>';

              Swal.fire({
                icon: 'error',
                title: 'Duplicate Information',
                html: errorMessage,
                confirmButtonText: 'OK',
                customClass: {
                  popup: 'bg-tileLight dark:bg-[#363636] text-black dark:text-white',
                  title: 'font-semibold text-lg',
                  htmlContainer: 'text-left',
                  confirmButton: 'bg-red-500 dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-700',
                },
              });
              return;
            }
          }


        );
      }



    }
  }

  onCancel() {
    Swal.fire({
      title: 'You have unsaved changes',
      text: 'If you leave this page now, your changes will be lost.\nDo you want to continue without saving?',
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
        this.filteredCenterArr = [...this.centerArr];
        console.log('centerArr', this.centerArr)

      }
    )
  }

  getAllManagers() {
    console.log('id', this.personalData.cofId)
    this.ManageOficerSrv.getCenterManagersForEdit(this.personalData.centerId, Number(this.personalData.cofId)).subscribe(
      (res) => {

        this.managerArr = res
        this.filteredManagerArr = [...this.managerArr];
        console.log('managerArr', this.managerArr)

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

  loadBanks(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<Bank[]>('assets/json/banks.json').subscribe(
        data => {
          this.banks = data.sort((a, b) => a.name.localeCompare(b.name));
          // Convert banks to dropdown items
          this.bankItems = this.banks.map(bank => ({
            value: bank.ID,
            label: bank.name
          }));
          resolve();
        },
        error => {
          console.error('Error loading banks:', error);
          reject(error);
        }
      );
    });
  }
  
  loadBranches(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<BranchesData>('assets/json/branches.json').subscribe(
        data => {
          Object.keys(data).forEach(bankID => {
            data[bankID].sort((a, b) => a.name.localeCompare(b.name));
          });
          this.allBranches = data;
          resolve();
        },
        error => {
          console.error('Error loading branches:', error);
          reject(error);
        }
      );
    });
  }
  
  matchExistingBankToDropdown() {
    // Only proceed if both banks and branches are loaded and we have existing data
    if (this.bankItems.length > 0 && Object.keys(this.allBranches).length > 0 &&
      this.personalData && this.personalData.bankName) {
  
      // Find the bank ID that matches the existing bank name
      const matchedBank = this.bankItems.find(bank => bank.label === this.personalData.bankName);
  
      if (matchedBank) {
        this.selectedBankId = matchedBank.value;
        // Load branches for this bank
        this.updateBranchItems(this.selectedBankId);
  
        // If we also have a branch name, try to match it
        if (this.personalData.branchName) {
          const matchedBranch = this.branchItems.find(branch => branch.label === this.personalData.branchName);
          if (matchedBranch) {
            this.selectedBranchId = matchedBranch.value;
          }
        }
      }
    }
  }
  
  updateBranchItems(bankId: number | null) {
    if (bankId) {
      this.branches = this.allBranches[bankId.toString()] || [];
      this.branchItems = this.branches.map(branch => ({
        value: branch.ID,
        label: branch.name
      }));
    } else {
      this.branches = [];
      this.branchItems = [];
    }
  }
  
  onBankChange(bankId: number | null) {
    if (bankId) {
      this.selectedBankId = bankId;
  
      // Update branches
      this.branches = this.allBranches[bankId.toString()] || [];
      this.branchItems = this.branches.map(br => ({
        value: br.ID,
        label: br.name
      }));
  
      // Update personalData
      const selectedBank = this.banks.find(bank => bank.ID === bankId);
      if (selectedBank) {
        this.personalData.bankName = selectedBank.name;
        this.invalidFields.delete('bankName');
      }
  
      // Reset branch selection
      this.selectedBranchId = null;
      this.personalData.branchName = '';
    } else {
      this.branches = [];
      this.branchItems = [];
      this.personalData.bankName = '';
    }
  }
  
  onBranchChange(selectedBranchId: number | null) {
    this.selectedBranchId = selectedBranchId;
    
    if (this.selectedBranchId) {
      // Update company data with branch name
      const selectedBranchItem = this.branchItems.find(branch => branch.value === this.selectedBranchId);
      if (selectedBranchItem) {
        this.personalData.branchName = selectedBranchItem.label;
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

  onSubmitForm1(form: NgForm) {

    console.log('personal data', this.personalData);
    form.form.markAllAsTouched();
    this.jobRoleInputTouched = true;

    this.validateLanguages();


    const missingFields: string[] = [];

  // Validation for pageOne fields
  // if (!this.personalData.empType) {
  //   missingFields.push('Staff Employee Type');
  // }

  if (!this.personalData.centerId && this.logingRole === 'Collection Centre Head') {
    missingFields.push('Collection Centre Name is required');
  }

  if (!this.personalData.jobRole) {
    missingFields.push('Job Role is required');
  }

  if (!this.personalData.irmId && this.personalData.jobRole === 'Collection Officer' && this.logingRole === 'Collection Centre Head') {
    missingFields.push('Collection Centre Manager is required');
  }

  if (this.languagesRequired) {
    missingFields.push('Please select at least one preferred language');
  }

  if (!this.personalData.employeeType) {
    missingFields.push('Employee Type is required');
  }

  

  // if (!this.personalData.companyId) {
  //   missingFields.push('Company Name');
  // }

  if (!this.personalData.firstNameEnglish) {
    missingFields.push('First Name (in English) is required');
  }

  if (!this.personalData.lastNameEnglish ) {
    missingFields.push('Last Name (in English) is required');
  }

  if (!this.personalData.firstNameSinhala) {
    missingFields.push('First Name (in Sinhala) is required');
  }

  if (!this.personalData.lastNameSinhala) {
    missingFields.push('Last Name (in Sinhala) is required');
  }

  if (!this.personalData.firstNameTamil) {
    missingFields.push('First Name (in Tamil) is required');
  }

  if (!this.personalData.lastNameTamil) {
    missingFields.push('Last Name (in Tamil) is required');
  }

  if (!this.personalData.phoneNumber01) {
    missingFields.push('Mobile Number - 1 is required');
  } else if (!/^[0-9]{9}$/.test(this.personalData.phoneNumber01) || this.isPhoneInvalidMap['phone01']) {
    missingFields.push('Mobile Number - 1 - Must be a valid 9-digit number (format: +947XXXXXXXX)');
  }

  if (this.personalData.phoneNumber02) {
    if (!/^[0-9]{9}$/.test(this.personalData.phoneNumber02) || this.isPhoneInvalidMap['phone02']) {
      missingFields.push('Mobile Number - 2 - Must be a valid 9-digit number (format: +947XXXXXXXX)');
    }
    if (this.personalData.phoneNumber01 === this.personalData.phoneNumber02) {
      missingFields.push('Mobile Number - 2 - Must be different from Mobile Number - 1');
    }
  }

  if (!this.personalData.nic) {
    missingFields.push('NIC Number is required');
  } else if (!/^(\d{9}[V]|\d{12})$/.test(this.personalData.nic)) {
    missingFields.push('NIC Number - Must be 9 digits followed by V or 12 digits');
  }

  if (!this.personalData.email) {
      missingFields.push('Email is required');
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.personalData.email)) {
      missingFields.push('Email - Must be in a valid format (format: example&#64;domain.com)');
    }

    if (missingFields.length > 0) {
      let errorMessage = '<div class="text-left"><p class="mb-2">Please fix the following issues:</p><ul class="list-disc pl-5">';
      missingFields.forEach((field) => {
        errorMessage += `<li>${field}</li>`;
      });
      errorMessage += '</ul></div>';
  
      Swal.fire({
        icon: 'error',
        title: 'Missing or Invalid Information',
        html: errorMessage,
        confirmButtonText: 'OK',
        customClass: {
          popup: 'bg-white dark:bg-[#363636] text-[#534E4E] dark:text-textDark',
          title: 'font-semibold text-lg',
          htmlContainer: 'text-left',
        },
      });
      return;
    }
  }

  onSubmitForm2(form: NgForm) {
    console.log('page2')

    form.form.markAllAsTouched();

    const missingFields: string[] = [];

    if (!this.personalData.houseNumber) {
      missingFields.push('House Number is required');
    }
  
    if (!this.personalData.streetName) {
      missingFields.push('Street Name is required');
    }
  
    if (!this.personalData.city) {
      missingFields.push('City is required');
    }
  
    if (!this.personalData.district) {
      missingFields.push('District is required');
    }
  
    if (!this.personalData.province) {
      missingFields.push('Province is required');
    }
  
    if (!this.personalData.accHolderName) {
      missingFields.push('Account Holder’s Name is required');
    }
  
    if (!this.personalData.accNumber) {
      missingFields.push('Account Number is required');
    }
  
    if (!this.personalData.conformAccNumber) {
      missingFields.push('Confirm Account Number is required');
    } else if (this.personalData.accNumber !== this.personalData.conformAccNumber) {
      missingFields.push('Confirm Account Number - Must match Account Number');
    }
  
    if (!this.selectedBankId) {
      missingFields.push('Bank Name is required');
    }
  
    if (!this.selectedBranchId) {
      missingFields.push('Branch Name is required');
    }
  
    // Display errors if any
    if (missingFields.length > 0) {
      let errorMessage = '<div class="text-left"><p class="mb-2">Please fix the following issues:</p><ul class="list-disc pl-5">';
      missingFields.forEach((field) => {
        errorMessage += `<li>${field}</li>`;
      });
      errorMessage += '</ul></div>';
  
      Swal.fire({
        icon: 'error',
        title: 'Missing or Invalid Information',
        html: errorMessage,
        confirmButtonText: 'OK',
        customClass: {
          popup: 'bg-white dark:bg-[#363636] text-[#534E4E] dark:text-textDark',
          title: 'font-semibold text-lg',
          htmlContainer: 'text-left',
        },
      });
      return;
    }
 
  }

  onSubmitForm3(form: NgForm) {
    console.log('page3')
    form.form.markAllAsTouched();

    const missingFields: string[] = [];

    if (!this.driverObj.licNo) {
      missingFields.push('License Number is Required');
    }

    if (!this.licenseFrontImageFileName && !this.driverObj.licFrontImg ) {
      missingFields.push("License's Front Image is required");
    }
  
    if (!this.licenseBackImageFileName && !this.driverObj.licBackImg ) {
      missingFields.push("License's Back Image is required");
    }

    if (!this.driverObj.insNo) {
      missingFields.push('Insurance Number is required');
    }

    if (!this.driverObj.insExpDate) {
      missingFields.push('Insurance Expire Date is required');
    }
  
    if (!this.insurenceFrontImageFileName && !this.driverObj.insFrontImg) {
      missingFields.push("Insurance's Front Image is required");
    }
  
    if (!this.insurenceBackImageFileName && !this.driverObj.insBackImg) {
      missingFields.push("Insurance's Back Image is required");
    }

    if (!this.driverObj.vRegNo) {
      missingFields.push('Vehicle Registration Number is required');
    }
  
    if (!this.driverObj.vType) {
      missingFields.push('Vehicle Type is required');
    }

    if (!this.driverObj.vCapacity) {
      missingFields.push('Vehicle Capacity is required');
    }

    if (!this.vehicleFrontImageFileName && !this.driverObj.vehFrontImg) {
      missingFields.push("Vehicle's Front Image is required");
    }

    if (!this.vehicleBackImageFileName && !this.driverObj.vehBackImg) {
      missingFields.push("Vehicle's Back Image Image is required");
    }
  
    if (!this.vehicleSideAImageFileName && !this.driverObj.vehSideImgA) {
      missingFields.push("Vehicle's Side Image - 1 is required");
    }

    if (!this.vehicleSideBImageFileName && !this.driverObj.vehSideImgB) {
      missingFields.push("Vehicle's Side Image - 2 is required");
    }
  
    // Display errors if any
    if (missingFields.length > 0) {
      let errorMessage = '<div class="text-left"><p class="mb-2">Please fix the following issues:</p><ul class="list-disc pl-5">';
      missingFields.forEach((field) => {
        errorMessage += `<li>${field}</li>`;
      });
      errorMessage += '</ul></div>';
  
      Swal.fire({
        icon: 'error',
        title: 'Missing or Invalid Information',
        html: errorMessage,
        confirmButtonText: 'OK',
        customClass: {
          popup: 'bg-white dark:bg-[#363636] text-[#534E4E] dark:text-textDark',
          title: 'font-semibold text-lg',
          htmlContainer: 'text-left',
        },
      });
      return;
    }
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

  // capitalizeFirstLetter(field: keyof typeof this.personalData) {
  //   if (this.personalData[field]) {
  //     // Trim spaces
  //     this.personalData[field] = this.personalData[field].trim();
  
  //     // Capitalize first letter
  //     this.personalData[field] =
  //       this.personalData[field].charAt(0).toUpperCase() +
  //       this.personalData[field].slice(1);
  //   }
  // }

  onTrimInput(event: Event, modelRef: any, fieldName: string): void {  // no spaces at all
    const inputElement = event.target as HTMLInputElement;
  
    if (inputElement) {
      // Trim spaces at start and end
      const trimmedValue = inputElement.value.trim();
  
      // Update model and input
      modelRef[fieldName] = trimmedValue;
      inputElement.value = trimmedValue;
    }
  }

  onFormatInput2(event: Event, modelRef: any, fieldName: string): void {  //trim spaces only from start
    const inputElement = event.target as HTMLInputElement;
  
    if (inputElement && inputElement.value) {
      // Trim spaces only at the start
      let value = inputElement.value.trimStart();
  
      // Capitalize first letter
      value = value.charAt(0).toUpperCase() + value.slice(1);
  
      // Update model
      modelRef[fieldName] = value;
  
      // Update input box value
      inputElement.value = value;
    }
  }

  onTrimInputAccountNumber(event: Event, modelRef: any, fieldName: string): void {
    const inputElement = event.target as HTMLInputElement;
  
    if (inputElement) {
      // Remove **all spaces** (not just trim)
      const noSpaceValue = inputElement.value.replace(/\s+/g, '');
  
      // Update model and input
      modelRef[fieldName] = noSpaceValue;
      inputElement.value = noSpaceValue;
    }
  }
  

  onFormatInput(event: Event, modelRef: any, fieldName: string): void {
    const inputElement = event.target as HTMLInputElement;
  
    if (inputElement && inputElement.value) {
      // Trim spaces at start & end
      let value = inputElement.value.trim();
  
      // Capitalize first letter
      value = value.charAt(0).toUpperCase() + value.slice(1);
  
      // Update model
      modelRef[fieldName] = value;
  
      // Update input box value
      inputElement.value = value;
    }
  }


  onNicInput(event: any) {
    // Get value and trim leading/trailing spaces
    let value: string = event.target.value.trimStart().toUpperCase();
  
    // Remove all invalid characters except digits and V
    value = value.replace(/[^0-9V]/g, '');
  
    // Prevent entering V anywhere except last character of 10-char NIC
    if (value.includes('V') && value.length !== 10) {
      value = value.replace(/V/g, '');
    }
  
    // Handle 10-char NIC ending with V
    if (value.length === 10 && value.endsWith('V')) {
      value = value.slice(0, 10);
    }
  
    // Limit 12-digit NIC
    if (value.length > 12) {
      value = value.slice(0, 12);
    }
  
    // Update the model
    this.personalData.nic = value;
  }


  openPopup(item: Personal) {
    console.log('personal', item);
    console.log('officerId', this.editOfficerId);
    this.isPopupVisible = true;
  
    const message = `Are you sure you want to reset password for this ${item.jobRole}?`;
  
    const approveButton = `
      <button id="approveButton" 
        class="bg-[#415CFF] hover:bg-[#415CFF] text-white px-4 py-2 rounded-lg mx-2">
        Reset Password
      </button>
    `;
  
    const cancelButton = `
      <button id="cancelButton" 
        class="bg-[#FF0000] hover:bg-[#FF0000] text-white px-4 py-2 rounded-lg mx-2">
        Cancel
      </button>
    `;
  
    const tableHtml = `
      <div class="rounded-xl container mx-auto">
        <h1 class="text-center text-2xl font-bold mb-4 dark:text-white">
          Officer Name: ${item.firstNameEnglish}
        </h1>
        <div>
          <p class="text-center dark:text-white">${message}</p>
        </div>
        <div class="flex justify-center mt-4">
          ${approveButton}
          ${cancelButton}
        </div>
      </div>
    `;
  
    const swalInstance = Swal.fire({
      html: tableHtml,
      showConfirmButton: false,
      width: 'auto',
      allowOutsideClick: true,
      background: 'bg-white dark:bg-[#363636]',
      color: 'text-gray-800 dark:text-white',
      customClass: {
        popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
        title: 'dark:text-white',
      },
      didOpen: () => {
        
        document.getElementById('approveButton')?.addEventListener('click', () => {
          Swal.close();
          this.handleStatusChange(swalInstance, this.editOfficerId);
        });
  
        document.getElementById('cancelButton')?.addEventListener('click', () => {
          Swal.close();
        });
      },
    });
  }
  

  private handleStatusChange(swalInstance: any, id: number) {
    // Show loading state
    this.isLoading = true;
    swalInstance.update({
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      customClass: {
        popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
        title: 'dark:text-white',
      },

      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.ManageOficerSrv.ResetPassword(id).subscribe({
      next: (res) => {
        swalInstance.close();
        if (res.status) {
          this.isLoading = false;
          swalInstance.close();
          this.toastSrv.success(`The Collection Officer Password was reseted successfully.`);
        } else {
          this.isLoading = false;
          console.log(`Failed to reset the Collection Officer's password.`)
        }
      },
      error: (err) => {
        swalInstance.close();
        this.isLoading = false;
        this.toastSrv.error(`An error occurred while reseting password. Please try again.`);
      }
    });
  }

  blockInvalidKeypressForPhone(event: KeyboardEvent) {

    const input = event.target as HTMLInputElement;
  
    // Allow control keys
    if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(event.key)) {
      return;
    }
  
    // Only allow digits
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      return;
    }
  
    // If first digit and not 7 → force 7
    if (input.value.length === 0 && event.key !== '7') {
      event.preventDefault();
  
      input.value = '7';                 // visually set
      input.dispatchEvent(new Event('input')); // update ngModel
    }
  }
  
  blockInvalidPasteForPhone(event: ClipboardEvent) {
  
    const pastedData = event.clipboardData?.getData('text') || '';
  
    // Must match 7XXXXXXXX
    if (!/^7[0-9]{0,8}$/.test(pastedData)) {
      event.preventDefault();
    }
  }
  
  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
  
    // Remove non-digits (extra safety)
    let value = input.value.replace(/\D/g, '');
  
    // If empty → do nothing
    if (value.length === 0) {
      input.value = '';
      return;
    }
  
    // If first digit is not 7 → force it
    if (value[0] !== '7') {
      value = '7' + value.substring(1);
    }
  
    input.value = value;
  
    // Trigger ngModel update
    input.dispatchEvent(new Event('input'));
  }

}




class Personal {
  cofId!: number;
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
  status!: string;

  accHolderName!: string;
  accNumber!: string;
  bankName!: string;
  branchName!: string;
  conformAccNumber!: string;

  jobRole!: string;
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





import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { Router } from '@angular/router';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { DistributedManageOfficersService } from '../../../services/Distributed-manage-officers-service/distributed-manage-officers.service';
import { Country, COUNTRIES } from '../../../../assets/country-data';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';
import { CustomDatepickerComponent } from '../../../components/custom-datepicker/custom-datepicker.component';

@Component({
  selector: 'app-add-distributed-officer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingSpinnerComponent, SerchableDropdownComponent, CustomDatepickerComponent],
  templateUrl: './add-distributed-officer.component.html',
  styleUrl: './add-distributed-officer.component.css'
})
export class AddDistributedOfficerComponent implements OnInit {
  oday: string = new Date().toISOString().split('T')[0];
  @ViewChild('scrollTarget') scrollTarget!: ElementRef;

  personalData: Personal = new Personal();
  collectionCenterData: CollectionCenter[] = []
  ManagerArr!: ManagerDetails[]
  centerArr: Center[] = [];
  managerArr: Manager[] = [];
  driverObj: Drivers = new Drivers()

  languages: string[] = ['Sinhala', 'English', 'Tamil'];
  selectedPage: 'pageOne' | 'pageTwo' | 'pageThree' = 'pageThree';
  lastID!: number
  itemId: number | null = null;
  officerId!: number
  selectVehicletype: any = { name: '', capacity: '' };
  isJobRoleOpen = false;
  insExpDateTouched = false;
  selectedFileName!: string
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  logingRole: string | null = null;
  languagesRequired: boolean = false;
  isLoading: boolean = false;
  banks: Bank[] = [];
  branches: Branch[] = [];
  selectedBankId: number | null = null;
  selectedBranchId: number | null = null;
  allBranches: BranchesData = {};
  bankItems: { value: number; label: string }[] = [];
  branchItems: { value: number; label: string }[] = [];
  invalidFields: Set<string> = new Set();
  //phone pattern validation
  allowedPrefixes = ['70', '71', '72', '75', '76', '77', '78'];
  isPhoneInvalidMap: { [key: string]: boolean } = {
    phone01: false,
    phone02: false,
  };

  countries: Country[] = COUNTRIES;
  selectedCountry1: Country | null = null;
  selectedCountry2: Country | null = null;

  dropdownOpen = false;
  dropdownOpen2 = false;

  filteredCenterArr: Center[] = [];
  filteredManagerArr: Manager[] = [];

  centreDropdownOpen = false;
  selectedCenterName: string = "";
  selectedManager: string = "";
  managerDropdownOpen = false;
  selectedManagerName: string = "";
  jobRoles: string[] = [];
  jobRoleInputTouched = false;
  vehicleTypeDropdownOpen = false;
  vehicleTypeTouched = false;

  // Driver Images
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

  isAppireImgValidation: boolean = false;

  constructor(
    private ManageOficerSrv: ManageOfficersService,
    private DistributedManageOfficerSrv: DistributedManageOfficersService,
    private router: Router,
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
    { name: 'Mahindra Bollero', capacity: 272 },
    { name: 'Dimo Batta', capacity: 750 },
    { name: 'Three Wheeler', capacity: 100 },
  ]

  ngOnInit(): void {
    this.loadBanks()
    this.loadBranches()
    this.getAllDistributionCenters();
    this.setJobRoles();
  }

  onDatePickerClicked() {
    this.insExpDateTouched = true;
  }

  onInsuranceDateChange(newDate: string | Date | null) {
    let dateString: string;
    if (!newDate) {
      dateString = '';
    }
    else if (newDate instanceof Date) {
      dateString = newDate.toISOString().split('T')[0];
    }
    else {
      dateString = newDate;
    }
    this.driverObj.insExpDate = dateString;
  }

  toggleJobRoleDropdown() {
    this.centreDropdownOpen = false;
    this.managerDropdownOpen = false;
    this.isJobRoleOpen = !this.isJobRoleOpen;
    this.jobRoleInputTouched = true;
  }

  getJobRole(role: string) {
    this.personalData.jobRole = role;
    if (this.personalData.jobRole === 'Driver') {
      this.personalData.firstNameSinhala = '';
      this.personalData.lastNameSinhala = ''
      this.personalData.firstNameTamil = ''
      this.personalData.lastNameTamil = ''
    }
    this.isJobRoleOpen = false;
    this.jobRoleInputTouched = true;
  }

  setJobRoles() {
    if (this.logingRole === 'Distribution Centre Manager') {
      // Only allow Collection Officer
      this.jobRoles = ['Distribution Officer', 'Driver'];
    }
    else if (this.logingRole === 'Distribution Centre Head') {
      // Allow all roles
      this.jobRoles = [
        'Distribution Centre Manager',
        'Distribution Officer',
        'Driver'
      ];
    }
    else {
      this.jobRoles = [];
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.isJobRoleOpen = false;
    }
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.toLowerCase();
    this.filteredCenterArr = this.centerArr.filter(c => {
      const combined1 = `${c.regCode}-${c.centerName}`.toLowerCase();
      const combined2 = `${c.regCode} - ${c.centerName}`.toLowerCase();
      return combined1.includes(value) || combined2.includes(value);
    }
    );

  }

  toggleDropdown() {
    this.isJobRoleOpen = false;
    this.managerDropdownOpen = false;
    this.centreDropdownOpen = !this.centreDropdownOpen;
  }

  toggleManagerDropdown() {
    this.isJobRoleOpen = false;
    this.centreDropdownOpen = false;
    this.managerDropdownOpen = !this.managerDropdownOpen;
  }

  selectCenter(item: Center) {

    this.personalData.centerId = item.id;
    this.selectedCenterName = item.centerName;
    this.centreDropdownOpen = false; // close dropdown
    this.filteredCenterArr = [...this.centerArr]; // show full list next time
    const searchInput = document.querySelector<HTMLInputElement>('.dropdown-search-input');
    if (searchInput) {
      searchInput.value = '';
    }
    this.changeCenter();
  }

  onManagerSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.toLowerCase().trim(); // remove leading/trailing spaces
    this.filteredManagerArr = this.managerArr.filter(m => {
      const fullName = `${m.empId}-${m.firstNameEnglish} ${m.lastNameEnglish}`.toLowerCase();
      const fullName2 = `${m.empId} - ${m.firstNameEnglish} ${m.lastNameEnglish}`.toLowerCase();
      return fullName.includes(value) || fullName2.includes(value);
    }
    );

  }

  selectManager(item: Manager) {
    this.personalData.irmId = item.id;
    this.selectedManager = item.empId + ' - ' + item.firstNameEnglish + ' ' + item.lastNameEnglish;
    this.managerDropdownOpen = false; // close dropdown
    // Reset search input and filtered array
    this.filteredManagerArr = [...this.managerArr]; // show full list next time
    const searchInput = document.querySelector<HTMLInputElement>('.dropdown-manager-search-input');
    if (searchInput) {
      searchInput.value = '';
    }
  }

  selectCountry1(country: Country) {
    this.selectedCountry1 = country;
    this.personalData.phoneNumber01Code = country.dialCode; // update ngModel
    this.dropdownOpen = false;
  }
  selectCountry2(country: Country) {
    this.selectedCountry2 = country;
    this.personalData.phoneNumber02Code = country.dialCode; // update ngModel
    this.dropdownOpen2 = false;
  }

  // get flag
  getFlagUrl(code: string): string {
    return `https://flagcdn.com/24x18/${code}.png`;
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
  }


  nextForm(page: 'pageOne' | 'pageTwo' | 'pageThree') {
    this.selectedPage = page;
    setTimeout(() => {
      this.scrollToTop();
    }, 0);
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
    const file: File = event.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        this.toastSrv.error('File size should not exceed 3MB');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.toastSrv.error('Only JPEG, JPG and PNG files are allowed')
        return;
      }
      this.selectedFile = file;
      this.selectedFileName = file.name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result; // Set selectedImage to the base64 string or URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  }

  onDistrictChange(districtName: string | null) {
    if (this.itemId !== null) return; // keep your original guard
    const selected = this.districts.find(d => d.name === districtName || '');
    this.personalData.province = selected ? selected.province : '';
  }

  onSubmit() {
    if (this.personalData.accNumber !== this.personalData.conformAccNumber) {
      return;
    }
    this.isLoading = true;

    if (!this.personalData.accHolderName || !this.personalData.accNumber || !this.personalData.bankName || !this.personalData.branchName) {
      this.isLoading = false;
      this.toastSrv.warning('Pleace fill all required bank details feilds')
      return;

    } else {
      if (this.logingRole === 'Distribution Centre Manager') {
        if (this.personalData.jobRole === 'Driver') {
          if (!this.licenseFrontImageFileName || !this.licenseBackImageFileName || !this.insurenceFrontImageFileName || !this.insurenceBackImageFileName || !this.vehicleFrontImageFileName || !this.vehicleBackImageFileName || !this.vehicleSideAImageFileName || !this.vehicleSideBImageFileName) {
            this.isLoading = false;
            this.toastSrv.warning('Pleace fill all required vehicle image upload fields')
            return;
          }
          this.driverObj.licFrontName = this.licenseFrontImageFileName
          this.driverObj.licBackName = this.licenseBackImageFileName
          this.driverObj.insFrontName = this.insurenceFrontImageFileName
          this.driverObj.insBackName = this.insurenceBackImageFileName
          this.driverObj.vFrontName = this.vehicleFrontImageFileName
          this.driverObj.vBackName = this.vehicleBackImageFileName
          this.driverObj.vSideAName = this.vehicleSideAImageFileName
          this.driverObj.vSideBName = this.vehicleSideBImageFileName
        }

        this.DistributedManageOfficerSrv.createDistributionOfficerDIO(this.personalData, this.selectedFile, this.driverObj, this.licenseFrontImagePreview, this.licenseBackImagePreview, this.insurenceFrontImagePreview, this.insurenceBackImagePreview, this.vehicleFrontImagePreview, this.vehicleBackImagePreview, this.vehicleSideAImagePreview, this.vehicleSideBImagePreview).subscribe(
          (res: any) => {
            if (res.status) {
              this.officerId = res.officerId;
              this.isLoading = false;
              this.toastSrv.success(`${this.personalData.jobRole} Created Successfully`)
              this.router.navigate(['/distribution-officers'])
            } else {
              this.isLoading = false;
              this.toastSrv.error(res.message)

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
      } else if (this.logingRole === 'Distribution Centre Head') {
        if (this.personalData.jobRole === 'Driver') {
          if (!this.licenseFrontImageFileName || !this.licenseBackImageFileName || !this.insurenceFrontImageFileName || !this.insurenceBackImageFileName || !this.vehicleFrontImageFileName || !this.vehicleBackImageFileName || !this.vehicleSideAImageFileName || !this.vehicleSideBImageFileName) {
            this.isLoading = false;
            this.toastSrv.warning('Pleace fill all required vehicle image upload fields')
            return;
          }
          this.driverObj.licFrontName = this.licenseFrontImageFileName
          this.driverObj.licBackName = this.licenseBackImageFileName
          this.driverObj.insFrontName = this.insurenceFrontImageFileName
          this.driverObj.insBackName = this.insurenceBackImageFileName
          this.driverObj.vFrontName = this.vehicleFrontImageFileName
          this.driverObj.vBackName = this.vehicleBackImageFileName
          this.driverObj.vSideAName = this.vehicleSideAImageFileName
          this.driverObj.vSideBName = this.vehicleSideBImageFileName
        }


        this.DistributedManageOfficerSrv.createDistributionOfficer(this.personalData, this.selectedFile, this.driverObj, this.licenseFrontImagePreview, this.licenseBackImagePreview, this.insurenceFrontImagePreview, this.insurenceBackImagePreview, this.vehicleFrontImagePreview, this.vehicleBackImagePreview, this.vehicleSideAImagePreview, this.vehicleSideBImagePreview).subscribe(
          (res: any) => {
            if (res.status) {
              this.officerId = res.officerId;
              this.isLoading = false;
              this.toastSrv.success(`${this.personalData.jobRole} Created Successfully`)
              this.router.navigate(['/distribution-officers'])
            } else {
              this.isLoading = false;
              this.toastSrv.error(res.message)
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
      } else {
        this.isLoading = false;
        this.toastSrv.error('There was an error creating the Distribution officer')
      }
    }
  }

  onCancel() {
    Swal.fire({
      title: 'You have unsaved changes',
      html: 'If you leave this page now, your changes will be lost.<br>Do you want to continue without saving?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Leave,<br>without saving',
      cancelButtonText: 'Stay,<br>on page',
      customClass: {
        popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
        title: 'dark:text-white',
        icon: '!border-gray-200 dark:!border-gray-500',
        confirmButton: 'w-36  rounded-lg hover:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500 dark:focus:ring-red-800',
        cancelButton: 'w-36 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-blue-800',
        actions: 'gap-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.personalData = new Personal();
        this.toastSrv.warning('Officer addition canceled.')
        this.location.back();
      }
    });
  }

  getAllDistributionCenters() {
    this.isLoading = true;
    this.DistributedManageOfficerSrv.getDCHOwnCenters().subscribe(
      (res) => {
        this.centerArr = res
        this.filteredCenterArr = [...this.centerArr];
        this.isLoading = false;
      }
    )
  }

  changeCenter() {
    this.personalData.jobRole = ''
    this.personalData.irmId = null
    this.selectedManager = ''
    this.getAllDistributionManagers()
  }

  getAllDistributionManagers() {
    this.isLoading = true;
    // this.personalData.jobRole = ''
    this.DistributedManageOfficerSrv.getDistributionCenterManagers(this.personalData.centerId).subscribe(
      (res) => {
        this.managerArr = res
        this.filteredManagerArr = [...this.managerArr];
        this.isLoading = false;
      }
    )
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
    if (input.length === 9 && isValidPrefix) {
      this.isPhoneInvalidMap[key] = false;
      return;
    }
    this.isPhoneInvalidMap[key] = false;
  }



  checkManager() {
    if (!this.personalData.centerId) {
      this.toastSrv.warning('Pleace select center before select manager')
      this.personalData.irmId = ''
      return;
    }
  }

  isAtLeastOneLanguageSelected(): boolean {
    return (
      !this.personalData.languages && this.personalData.languages.length > 0
    );
  }

  onSubmitFormPage1(form: NgForm) {
    form.form.markAllAsTouched();
    this.validateLanguages();
    const missingFields: string[] = [];
    if (!this.personalData.centerId && this.logingRole === 'Distribution Centre Head') {
      missingFields.push('Distribution Centre Name is required');
    }

    if (!this.personalData.irmId && this.personalData.jobRole === 'Distribution Officer' && this.logingRole === 'Distribution Centre Head') {
      missingFields.push('Distribution Centre Manager is required');
    }

    if (this.languagesRequired) {
      missingFields.push('Please select at least one preferred language');
    }

    if (!this.personalData.employeeType) {
      missingFields.push('Employee Type is required');
    }

    if (!this.personalData.jobRole) {
      missingFields.push('Job Role is required');
    }

    if (!this.personalData.firstNameEnglish) {
      missingFields.push('First Name (in English) is required');
    }

    if (!this.personalData.lastNameEnglish) {
      missingFields.push('Last Name (in English) is required');
    }

    if (!this.personalData.firstNameSinhala && this.personalData.jobRole !== 'Driver') {
      missingFields.push('First Name (in Sinhala) is required');
    }

    if (!this.personalData.lastNameSinhala && this.personalData.jobRole !== 'Driver') {
      missingFields.push('Last Name (in Sinhala) is required');
    }

    if (!this.personalData.firstNameTamil && this.personalData.jobRole !== 'Driver') {
      missingFields.push('First Name (in Tamil) is required');
    }

    if (!this.personalData.lastNameTamil && this.personalData.jobRole !== 'Driver') {
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
      let errorMessage = '<div class="text-left"><p class="mb-2">Please fill all required fields:</p><ul class="list-disc pl-5">';
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



  onSubmitFormPage2(form: NgForm) {
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
      let errorMessage = '<div class="text-left"><p class="mb-2">Please fill all required fields:</p><ul class="list-disc pl-5">';
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

  onSubmitFormPage3(form: NgForm) {
    form.form.markAllAsTouched();
    this.onDatePickerClicked();
    this.vehicleTypeTouched = true;

    const missingFields: string[] = [];

    if (!this.driverObj.licNo) {
      missingFields.push('Driving License ID number is Required');
    } else if (!/^([A-Z]\d{7}|\d{10,12})$/.test(this.driverObj.licNo)) {
      missingFields.push('Please enter a valid License ID number (1 capital letter + 7 digits or 10–12 digits).');
    }

    if (!this.driverObj.confirmLicNo) {
      missingFields.push('Confirm Driving License ID number is Required');
    } else if (this.driverObj.licNo !== this.driverObj.confirmLicNo) {
      missingFields.push('Confirm Driving License ID number should match the Driving License ID number.');
    }

    if (!this.driverObj.insNo) {
      missingFields.push('Insurance Number is Required');
    }
    if (!this.driverObj.confirmInsNo) {
      missingFields.push('Confirm Insurance Number is Required');
    } else if (this.driverObj.insNo !== this.driverObj.confirmInsNo) {
      missingFields.push('Confirm Insurance Number should match the Insurance Number.');
    }

    if (!this.driverObj.vRegNo) {
      missingFields.push('Vehicle Registration Number is Required');
    }

    if (!this.driverObj.confirmVRegNo) {
      missingFields.push(' Confirm Vehicle Registration Number is Required');
    } else if (this.driverObj.vRegNo !== this.driverObj.confirmVRegNo) {
      missingFields.push('Confirm Vehicle Registration Number should match the Vehicle Registration Number.');
    }

    if (!this.licenseFrontImageFileName) {
      missingFields.push("License's Front Image is required");
    }

    if (!this.licenseBackImageFileName) {
      missingFields.push("License's Back Image is required");
    }

    if (!this.driverObj.insExpDate) {
      missingFields.push('Insurance Expire Date is required');
    }

    if (!this.insurenceFrontImageFileName) {
      missingFields.push("Insurance's Front Image is required");
    }

    if (!this.insurenceBackImageFileName) {
      missingFields.push("Insurance's Back Image is required");
    }

    if (!this.driverObj.vType) {
      missingFields.push('Vehicle Type is required');
    }

    if (!this.driverObj.vCapacity) {
      missingFields.push('Vehicle Capacity is required');
    }

    if (!this.vehicleFrontImageFileName) {
      missingFields.push("Vehicle's Front Image is required");
    }

    if (!this.vehicleBackImageFileName) {
      missingFields.push("Vehicle's Back Image Image is required");
    }

    if (!this.vehicleSideAImageFileName) {
      missingFields.push("Vehicle's Side Image - 1 is required");
    }

    if (!this.vehicleSideBImageFileName) {
      missingFields.push("Vehicle's Side Image - 2 is required");
    }

    // Display errors if any
    if (missingFields.length > 0) {
      let errorMessage = '<div class="text-left"><p class="mb-2">Please fill all required fields:</p><ul class="list-disc pl-5">';
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


  loadBanks() {
    this.http.get<Bank[]>('assets/json/banks.json').subscribe(
      data => {
        this.banks = data.sort((a, b) => a.name.localeCompare(b.name));
        this.bankItems = this.banks.map(b => ({
          value: b.ID,
          label: b.name
        }));
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

  onBranchChange(branchId: number | null) {
    if (branchId) {
      this.selectedBranchId = branchId;

      const selectedBranch = this.branches.find(branch => branch.ID === branchId);
      if (selectedBranch) {
        this.personalData.branchName = selectedBranch.name;
        this.invalidFields.delete('branchName');
      }
    } else {
      this.personalData.branchName = '';
    }
  }

  allowOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // Only allow 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  onTrimInput(event: Event, modelRef: any, fieldName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const trimmedValue = inputElement.value.trimStart();
    modelRef[fieldName] = trimmedValue;
    inputElement.value = trimmedValue;
  }

  onFormatInput(event: Event, modelRef: any, fieldName: string): void {       // no spaces at all
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


  onTrimInputCapitalize(event: Event, modelRef: any, fieldName: string): void {
    const inputElement = event.target as HTMLInputElement;
    let trimmedValue = inputElement.value.trimStart();
    if (trimmedValue.length > 0) {
      trimmedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1);
    }

    modelRef[fieldName] = trimmedValue;
    inputElement.value = trimmedValue;
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

  blockNonNumbers(event: KeyboardEvent) {
    // Allow: numbers (0-9), backspace, delete, arrow keys, tab
    const allowedKeys = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'
    ];

    // Block if key is not allowed
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  capitalizeAccHolderName(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value.trimStart().replace(/\s+/g, ' ');

    // Capitalize first letter
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    this.personalData.accHolderName = value;
    inputElement.value = value;
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

  // Replace onFileSelected with this more specific version
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

  toggleVehicleTypeDropdown() {
    this.vehicleTypeDropdownOpen = !this.vehicleTypeDropdownOpen;
    this.vehicleTypeTouched = true;
  }

  selectVehicleTypeItem(item: { name: string; capacity: number }) {
    this.selectVehicletype = item;
    this.vehicleChange();
    this.vehicleTypeDropdownOpen = false;
    this.vehicleTypeTouched = true;
  }

  onDateChange(newDate: string | Date | null) {
    let dateString: string;

    if (!newDate) {

      dateString = new Date().toISOString().split('T')[0];
    }
    else if (newDate instanceof Date) {

      dateString = newDate.toISOString().split('T')[0];
    }
    else {

      dateString = newDate;
    }

    this.driverObj.insExpDate = dateString;
  }

  preventSpecialcharacters(event: KeyboardEvent) {
    const allowedPattern = /^[a-zA-Z0-9]$/;
    const inputChar = event.key;

    if (!allowedPattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  preventSpecialCharactersPaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text') || '';
    const allowedPattern = /^[a-zA-Z0-9]+$/;

    if (!allowedPattern.test(pastedText)) {
      event.preventDefault();
    }
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
  firstNameEnglish!: string;
  firstNameSinhala!: string;
  firstNameTamil!: string;
  lastNameEnglish!: string;
  lastNameSinhala!: string;
  lastNameTamil!: string;
  phoneNumber01Code: string = '+94';
  phoneNumber01!: string;
  phoneNumber02Code: string = '+94';
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

  accHolderName!: string;
  accNumber!: string;
  bankName!: string;
  branchName!: string;
  conformAccNumber!: string;

  jobRole: string = '';
  empId!: string
  employeeType!: string;

  image!: any

  centerId: number | string = '';
  irmId: number | string | null = null;
}



class CollectionCenter {
  id!: number
  centerName!: string

}

class ManagerDetails {
  id!: number
  firstNameEnglish!: string
  lastNameEnglish!: string
}

class Center {
  id!: number
  centerName!: string
  regCode!: string;
}

class Manager {
  id!: number;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
  empId!: string;
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

class Drivers {
  licNo!: string;
  insNo!: string;
  insExpDate!: string;
  vType!: string;
  vCapacity!: string;
  vRegNo!: string;
  confirmLicNo!: string;
  confirmInsNo!: string;
  confirmVRegNo!: string;

  licFrontName!: string;
  licBackName!: string;
  insFrontName!: string;
  insBackName!: string;
  vFrontName!: string;
  vBackName!: string;
  vSideAName!: string;
  vSideBName!: string;
}



interface BranchesData {
  [key: string]: Branch[];
}
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { Router } from '@angular/router';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Country, COUNTRIES } from '../../../../assets/country-data';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';


@Component({
  selector: 'app-add-officers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingSpinnerComponent, SerchableDropdownComponent],
  templateUrl: './add-officers.component.html',
  styleUrl: './add-officers.component.css'
})
export class AddOfficersComponent implements OnInit {
  today: string = new Date().toISOString().split('T')[0];

  personalData: Personal = new Personal();
  collectionCenterData: CollectionCenter[] = []
  ManagerArr!: ManagerDetails[]
  centerArr: Center[] = [];
  managerArr: Manager[] = [];
  driverObj: Drivers = new Drivers()



  languages: string[] = ['Sinhala', 'English', 'Tamil'];
  selectedPage: 'pageOne' | 'pageTwo' | 'pageThree' = 'pageTwo';
  lastID!: number
  itemId: number | null = null;
  officerId!: number

  selectVehicletype: any = { name: '', capacity: '' };


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

  filteredCenterArr: Center[] = [];
  filteredManagerArr: Manager[] = [];

  centreDropdownOpen = false;
  selectedCenterName: string = "";
  selectedManager: string = "";
  managerDropdownOpen = false;
  selectedManagerName: string = "";

  constructor(
    private ManageOficerSrv: ManageOfficersService,
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
    { name: 'Lorry', capacity: 2 },
    { name: 'Dimo Batta', capacity: 3.5 },
    { name: 'Van', capacity: 2.5 },
    { name: 'Cab', capacity: 0.5 },
  ]



  ngOnInit(): void {
    this.loadBanks()
    this.loadBranches()
    this.getAllCenters();
    
    // this.getLastID('COO');
    // this.EpmloyeIdCreate();
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
    console.log('changing')
    console.log('perosnal center change,',  this.personalData)
    this.personalData.jobRole = ''
    this.personalData.irmId = null
    this.selectedManager = ''
    this.filteredManagerArr = []
    console.log('personalData.irmId', this.personalData.irmId)
    console.log('filteredManagerArr', this.filteredManagerArr)
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
    console.log('selectedManager', this.selectedManager )
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

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.toLowerCase();
    console.log('value', value);
  
    this.filteredCenterArr = this.centerArr.filter(c =>
      (c.centerName || '').toLowerCase().includes(value)
    );
  
    console.log('filtered centers', this.filteredCenterArr);
  
  }

  selectCountry1(country: Country) {
    this.selectedCountry1 = country;
    this.personalData.phoneNumber01Code = country.dialCode; // update ngModel
    console.log('sdsf', this.personalData.phoneNumber01Code)
    this.dropdownOpen = false;
  }

  selectCountry2(country: Country) {
    this.selectedCountry2 = country;
    this.personalData.phoneNumber02Code = country.dialCode; // update ngModel
    console.log('sdsf', this.personalData.phoneNumber02Code)
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


  validateLanguages() {
    this.languagesRequired = !this.personalData.languages || this.personalData.languages.trim() === '';
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
    const file: File = event.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        this.toastSrv.error('File size should not exceed 5MB')
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

  // getLastID(role: string): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     this.ManageOficerSrv.getForCreateId(role).subscribe(
  //       (res) => {
  //         this.lastID = res.result.empId;
  //         const lastId = res.result.empId;
  //         resolve(lastId); // Resolve the Promise with the empId
  //       },
  //       (error) => {
  //         console.error('Error fetching last ID:', error);
  //         reject(error);
  //       }
  //     );
  //   });
  // }

  // EpmloyeIdCreate() {
  //   let rolePrefix: string;
  //   if (this.personalData.jobRole === 'Collection Center Manager') {
  //     rolePrefix = 'CCM';
  //   } else if (this.personalData.jobRole === 'Customer Officer') {
  //     rolePrefix = 'CUO';
  //   } else if (this.personalData.jobRole === 'Driver') {
  //     rolePrefix = 'DVR';
  //   } else {
  //     rolePrefix = 'COO';
  //   }

  //   this.getLastID(rolePrefix).then((lastID) => {
  //     this.personalData.empId = rolePrefix + lastID;
  //   });
  // }

  // updateProvince(event: Event): void {
  //   const target = event.target as HTMLSelectElement; // Cast to HTMLSelectElement
  //   const selectedDistrict = target.value;

  //   const selected = this.districts.find(district => district.name === selectedDistrict);

  //   if (this.itemId === null) {

  //     if (selected) {
  //       this.personalData.province = selected.province;
  //     } else {
  //       this.personalData.province = '';
  //     }

  //   }

  // }

  onDistrictChange(districtName: string | null) {
    if (this.itemId !== null) return; // keep your original guard

    const selected = this.districts.find(d => d.name === districtName || '');
    this.personalData.province = selected ? selected.province : '';
  }

  onSubmit() {
    // this.personalData.image = this.selectedFile;
    if (this.personalData.accNumber !== this.personalData.conformAccNumber) {
      return;
    }
    this.isLoading = true;
    this.isAppireImgValidation = true;

    this.vehicleSideBImageFile
    if (!this.personalData.accHolderName || !this.personalData.accNumber || !this.personalData.bankName || !this.personalData.branchName) {
      this.isLoading = false;
      this.toastSrv.warning('Pleace fill all required bank details feilds')
      return;

    } else {
      if (this.logingRole === 'Collection Center Manager') {
        this.ManageOficerSrv.createCollectiveOfficer(this.personalData, this.selectedImage).subscribe(
          (res: any) => {
            if (res.status) {
              this.officerId = res.officerId;
              this.isLoading = false;
              this.toastSrv.success('Collective Officer Created Successfully')
              this.router.navigate(['/manage-officers'])
            } else {
              this.isLoading = false;
              // this.toastSrv.error('There was an error creating the collective officer')
              this.toastSrv.error(res.message)

            }
          },
          (error: any) => {
            this.isLoading = false;
            this.toastSrv.error('There was an error creating the collective officer')
          }
        );
      } else if (this.logingRole === 'Collection Center Head') {

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

        this.ManageOficerSrv.CCHcreateCollectiveOfficer(this.personalData, this.selectedImage, this.driverObj, this.licenseFrontImagePreview, this.licenseBackImagePreview, this.insurenceFrontImagePreview, this.insurenceBackImagePreview, this.vehicleFrontImagePreview, this.vehicleBackImagePreview, this.vehicleSideAImagePreview, this.vehicleSideBImagePreview).subscribe(
          (res: any) => {
            if (res.status) {
              this.officerId = res.officerId;
              this.isLoading = false;
              this.toastSrv.success('Collective Officer Created Successfully')
              this.router.navigate(['/manage-officers'])
            } else {
              this.isLoading = false;
              // this.toastSrv.error('There was an error creating the collective officer')
              this.toastSrv.error(res.message)


            }
          },
          (error: any) => {
            this.isLoading = false;
            this.toastSrv.error('There was an error creating the collective officer')
          }
        );
      } else {
        this.isLoading = false;
        this.toastSrv.error('There was an error creating the collective officer')
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
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, Stay On Page',
      customClass: {
        popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
        title: 'dark:text-white',

        icon: '!border-gray-200 dark:!border-gray-500',
        confirmButton: 'hover:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500 dark:focus:ring-red-800',
        cancelButton: 'hover:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-blue-800',
        actions: 'gap-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.personalData = new Personal();
        this.toastSrv.warning('Officer Add canceled.')
        this.location.back();

      }
    });
  }

  getAllCenters() {
    this.isLoading = true;
    this.ManageOficerSrv.getCCHOwnCentersWithOutRegCode().subscribe(
      (res) => {
        this.centerArr = res
        this.filteredCenterArr = [...this.centerArr];
        console.log('centerArr', this.centerArr)
        this.isLoading = false;

      }
    )
  }

  

  getAllManagers() {
    this.isLoading = true;
    this.ManageOficerSrv.getCenterManagers(this.personalData.centerId).subscribe(
      (res) => {
        this.managerArr = res
        this.filteredManagerArr = [];
        this.filteredManagerArr = [...this.managerArr];
        console.log('managerArr', this.managerArr)
        console.log('perosnal,',  this.personalData)
        this.isLoading = false;


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

  isAtLeastOneLanguageSelected(): boolean {
    return (
      !this.personalData.languages && this.personalData.languages.length > 0
    );
  }

  onSubmitForm(form: NgForm) {
    form.form.markAllAsTouched();

    this.validateLanguages();
  }


  loadBanks() {
    this.http.get<Bank[]>('assets/json/banks.json').subscribe(
      data => {
        this.banks = data.sort((a, b) => a.name.localeCompare(b.name));
  
        // Map to dropdown items
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

  jobRole: string = 'Collection Officer'
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

class Drivers {
  licNo!: string;
  insNo!: string;
  insExpDate!: string;
  vType!: string;
  vCapacity!: string;
  vRegNo!: string;

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
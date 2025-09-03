import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { DistributedManageOfficersService } from '../../../services/Distributed-manage-officers-service/distributed-manage-officers.service';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';
import { Country, COUNTRIES } from '../../../../assets/country-data';

@Component({
  selector: 'app-edit-distributed-officer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingSpinnerComponent, SerchableDropdownComponent],
  templateUrl: './edit-distributed-officer.component.html',
  styleUrl: './edit-distributed-officer.component.css'
})
export class EditDistributedOfficerComponent implements OnInit {
 

  personalData: Personal = new Personal();
  centerArr: Center[] = [];
  managerArr: Manager[] = [];
  driverObj: Drivers = new Drivers()

  allowedPrefixes = ['70', '71', '72', '75', '76', '77', '78'];
  isPhoneInvalidMap: { [key: string]: boolean } = {
  phone01: false,
  phone02: false,
};

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

  languagesRequired: boolean = false;

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

bankItems: { value: number; label: string }[] = [];
branchItems: { value: number; label: string }[] = [];

  invalidFields: Set<string> = new Set();
  naviPath!: string

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

  constructor(
    private ManageOficerSrv: ManageOfficersService,
    private router: Router,
    private route: ActivatedRoute,
    private toastSrv: ToastAlertService,
    private tokenSrv: TokenServiceService,
    private http: HttpClient,
    private location: Location,
    private DistributedManageOfficerSrv: DistributedManageOfficersService

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
    // this.getAllCollectionCetnter();
    this.loadBanks();
    this.loadBranches();
    this.getAllCenters();
    this.editOfficerId = this.route.snapshot.params['id'];
    console.log('editOfficerId', this.editOfficerId)
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

  fetchOffierById(id: number) {
    this.isLoading = true;
    this.DistributedManageOfficerSrv.getOfficerById(id).subscribe(
      (res: any) => {
        console.log('res', res)
        console.log('job', res.officerData.collectionOfficer.jobRole)
        
        this.personalData = res.officerData.collectionOfficer;
        console.log('personalDatajon', this.personalData.jobRole)
        console.log('PERSONAL', this.personalData)
        this.personalData.conformAccNumber = this.personalData.accNumber
        console.log(this.personalData);
        this.ExistirmId = res.officerData.irmId;
        this.personalData.jobRole = res.officerData.collectionOfficer.jobRole
        console.log('persjobrole' , this.personalData.jobRole)
        this.personalData.previousjobRole = res.officerData.collectionOfficer.jobRole;
        this.personalData.previousEmpId = res.officerData.collectionOfficer.empIdPrefix
        this.selectedCenterName = res.officerData.collectionOfficer.centerName

        this.selectedManager = res.managerName.firstNameEnglish + ' ' + res.managerName.lastNameEnglish
        console.log('previousjobRole', this.personalData.previousjobRole)
  
        this.getUpdateLastID(res.officerData.collectionOfficer.jobRole);
        
        this.personalData.previousQR = this.personalData.QRcode;
        this.personalData.previousImage = this.personalData.image;
  
        console.log('personaldarta', this.personalData)
  
        // Initialize languages as a comma-separated string if it's not already in that format
        if (Array.isArray(this.personalData.languages)) {
          this.personalData.languages = this.personalData.languages.join(',');
        } else if (!this.personalData.languages) {
          this.personalData.languages = '';
        }
  
        this.selectJobRole = res.officerData.collectionOfficer.jobRole;
        this.getAllManagers();
  
        // Load banks and branches data first, then match existing data
        this.loadBanksAndBranches().then(() => {
          this.matchExistingBankToDropdown();
        });
        
        this.isLoading = false;
      }
    );
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

  // fetchOffierById(id: number) {
  //   this.isLoading = true;
  //   this.ManageOficerSrv.getOfficerById(id).subscribe(
  //     (res: any) => {

  //       this.personalData = res.officerData.collectionOfficer;
  //       this.personalData.conformAccNumber = this.personalData.accNumber
  //       console.log(this.personalData);
  //       this.ExistirmId = res.officerData.irmId;

  //       this.getUpdateLastID(res.officerData.collectionOfficer.jobRole);
  //       this.driverObj = res.officerData.driver;
  //       this.driverObj.insExpDate = this.formatDateForInput(this.driverObj.insExpDate);
  //       this.selectVehicletype = this.VehicleTypes.find(
  //         (v) => v.name === this.driverObj.vType && v.capacity === this.driverObj.vCapacity
  //       );
  //       this.personalData.previousQR = this.personalData.QRcode;
  //       this.personalData.previousImage = this.personalData.image;


  //       // Initialize languages as a comma-separated string if it's not already in that format
  //       if (Array.isArray(this.personalData.languages)) {
  //         this.personalData.languages = this.personalData.languages.join(',');
  //       } else if (!this.personalData.languages) {
  //         this.personalData.languages = '';
  //       }

  //       this.selectJobRole = res.officerData.collectionOfficer.jobRole;
  //       this.getAllManagers();


  //       this.UpdateEpmloyeIdCreate();
  //       this.matchExistingBankToDropdown();
  //       this.isLoading = false;

  //     }
  //   );
  // }

  formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  private setActiveTabFromRoute(): void {
    const currentPath = this.router.url.split('?')[0];
    // Extract the first segment after the initial slash
    this.naviPath = currentPath.split('/')[1];
  }


  getUpdateLastID(role: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.ManageOficerSrv.getForCreateId(role).subscribe(
        (res) => {
          let lastId;
          if (this.selectJobRole === this.personalData.jobRole) {
            lastId = this.personalData.empId;
            this.UpdatelastID = lastId;


          } else {
            this.UpdatelastID = res.result.empId;
            lastId = res.result.empId


          }
          ;
          resolve(lastId); // Resolve the Promise with the empId
        },
        (error) => {
          console.error('Error fetching last ID:', error);
          reject(error);
        }
      );
    });
  }


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

  // updateProvince(event: Event): void {
  //   const target = event.target as HTMLSelectElement;
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

  // onSubmit() {
  //     console.log('personaldata', this.personalData)
  // }

  onSubmit() {
    console.log('personaldata', this.personalData)

    // this.personalData.empId = this.upateEmpID;

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

      if (this.logingRole === 'Distribution Center Manager') {
        this.DistributedManageOfficerSrv.updateDistributionOfficerDIO(this.personalData, this.editOfficerId, this.selectedImage).subscribe(
          (res: any) => {
            this.officerId = res.officerId;
            this.isLoading = false;
            if (res && res.message) {
              // Success response from backend
              this.toastSrv.success('Distribution Officer Profile Updated Successfull');
              this.router.navigate(['/distribution-officers']);
            } else {
              // Handle unexpected format
              this.toastSrv.error('Something went wrong while updating.');
            }

          },
          (error: any) => {
            this.isLoading = false;
            if (error.status === 409) {
              this.toastSrv.error('NIC already exists for another Distribution officer');
            } else if (error.status === 410) {
              this.toastSrv.error('Email already exists for another Distribution officer');
            } else if (error.status === 411) {
              this.toastSrv.error('Phone Number 01 already exists for another Distribution officer');
            } else if (error.status === 412) {
              this.toastSrv.error('Phone Number 02 already exists for another Distribution officer');
            } else if (error.status === 400) {
              this.toastSrv.error('No file uploaded. Please attach required file(s).');
            } else if (error.status === 500) {
              this.toastSrv.error('Internal server error. Please try again later.');
            } else {
              this.toastSrv.error('An unexpected error occurred.');
            }

          }
        );
      } else if (this.logingRole === 'Distribution Center Head') {
        if (this.personalData.jobRole === 'Distribution Center Manager') {
          this.personalData.irmId = null;
        }

        this.DistributedManageOfficerSrv.updateDistributionOfficer(this.personalData, this.editOfficerId, this.selectedImage).subscribe(
          (res: any) => {
            this.isLoading = false;

            if (res && res.message) {
              // Success response from backend
              this.toastSrv.success('Distribution Officer Profile Updated Successfully');
              this.router.navigate(['/distribution-officers']);
            } else {
              // Handle unexpected format
              this.toastSrv.error('Something went wrong while updating.');
            }
          },
          (error: any) => {
            this.isLoading = false;

            if (error.status === 409) {
              this.toastSrv.error('NIC already exists for another Distribution officer');
            } else if (error.status === 410) {
              this.toastSrv.error('Email already exists for another Distribution officer');
            } else if (error.status === 411) {
              this.toastSrv.error('Phone Number 01 already exists for another Distribution officer');
            } else if (error.status === 412) {
              this.toastSrv.error('Phone Number 02 already exists for another Distribution officer');
            } else if (error.status === 400) {
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
        this.toastSrv.warning('Officer Edit Canceled.')
        this.location.back();

      }
    });
  }


  getAllCenters() {
    this.DistributedManageOfficerSrv.getDCHOwnCenters().subscribe(
      (res) => {
        this.centerArr = res
        this.filteredCenterArr = [...this.centerArr];
        console.log('centerArr', this.centerArr)

      }
    )


  }

  changeCenter() {
     this.personalData.jobRole = ''
     this.personalData.irmId = null
     this.selectedManager = ''
    this.getAllManagers()
  }

  getAllManagers() {
    this.DistributedManageOfficerSrv.getDistributionCenterManagers(this.personalData.centerId).subscribe(
      (res) => {
        // this.personalData.jobRole = ''
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

  async loadBanksAndBranches(): Promise<void> {
    try {
      // Load both banks and branches data
      await Promise.all([this.loadBanks(), this.loadBranches()]);
    } catch (error) {
      console.error('Error loading banks and branches:', error);
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
  
  onBankChange(selectedBankId: number | null) {
    this.selectedBankId = selectedBankId;
    
    if (this.selectedBankId) {
      // Update branches based on selected bank
      this.updateBranchItems(this.selectedBankId);
  
      // Update company data with bank name
      const selectedBankItem = this.bankItems.find(bank => bank.value === this.selectedBankId);
      if (selectedBankItem) {
        this.personalData.bankName = selectedBankItem.label;
      }
  
      // Reset branch selection if the current selection doesn't belong to this bank
      const currentBranch = this.branchItems.find(branch => branch.value === this.selectedBranchId);
      if (!currentBranch) {
        this.selectedBranchId = null;
        this.personalData.branchName = '';
      }
    } else {
      this.updateBranchItems(null);
      this.selectedBranchId = null;
      this.personalData.bankName = '';
      this.personalData.branchName = '';
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

  // onSubmitForm(form: NgForm) {
  //   form.form.markAllAsTouched();
  // }

  onSubmitFormPage1(form: NgForm) {
    console.log('personal', this.personalData)
    form.form.markAllAsTouched();

    this.validateLanguages();

    const missingFields: string[] = [];

  // Validation for pageOne fields
  // if (!this.personalData.empType) {
  //   missingFields.push('Staff Employee Type');
  // }

  if (!this.personalData.centerId && this.personalData.jobRole === 'Distribution Officer') {
    missingFields.push('Distribution Centre Name is required');
  }

  if (!this.personalData.irmId && this.personalData.jobRole === 'Distribution Officer') {
    missingFields.push('Distribution Centre Manager is required');
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
    missingFields.push('Phone Number - 1 is required');
  } else if (!/^[0-9]{9}$/.test(this.personalData.phoneNumber01) || this.isPhoneInvalidMap['phone01']) {
    missingFields.push('Phone Number - 1 - Must be a valid 9-digit number (format: +947XXXXXXXX)');
  }

  if (this.personalData.phoneNumber02) {
    if (!/^[0-9]{9}$/.test(this.personalData.phoneNumber02) || this.isPhoneInvalidMap['phone02']) {
      missingFields.push('Phone Number - 2 - Must be a valid 9-digit number (format: +947XXXXXXXX)');
    }
    if (this.personalData.phoneNumber01 === this.personalData.phoneNumber02) {
      missingFields.push('Phone Number - 2 - Must be different from Phone Number - 1');
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

    this.onSubmit();  
  }

  onSubmitFormPage3(form: NgForm) {
    form.form.markAllAsTouched();
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

onTrimInput(event: Event, modelRef: any, fieldName: string): void {
  const inputElement = event.target as HTMLInputElement;
  const trimmedValue = inputElement.value.trimStart();
  modelRef[fieldName] = trimmedValue;
  inputElement.value = trimmedValue;
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


  navigateToCenters() {
    this.router.navigate(['/centers']); // Change '/reports' to your desired route
  }

  navigateToCenterDashboard() {
    this.router.navigate(['/centers/center-shashbord', this.centerId]); // Change '/reports' to your desired route
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

  jobRole!: string;
  empId!: string    //empIdWithoutPrefix
  employeeType!: string;

  image!: any

  previousQR!: string
  previousImage!: string


  centerId: number | string = '';
  irmId: number | string | null = '';
  previousjobRole!: string;
  empIdFirst!: string;       //prifix
  empIdPrefix!: string; 
  previousEmpId!: string;     //entire empId

  myJobRole!: string;

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

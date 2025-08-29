import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-add-distributed-officer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './add-distributed-officer.component.html',
  styleUrl: './add-distributed-officer.component.css'
})
export class AddDistributedOfficerComponent implements OnInit {
  oday: string = new Date().toISOString().split('T')[0];

  personalData: Personal = new Personal();
  collectionCenterData: CollectionCenter[] = []
  ManagerArr!: ManagerDetails[]
  centerArr: Center[] = [];
  managerArr: Manager[] = [];
  driverObj: Drivers = new Drivers()

  languages: string[] = ['Sinhala', 'English', 'Tamil'];
  selectedPage: 'pageOne' | 'pageTwo' | 'pageThree' = 'pageOne';
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

  invalidFields: Set<string> = new Set();
  
  //phone pattern validation
  allowedPrefixes = ['70', '71', '72', '75', '76', '77', '78'];
  isPhoneInvalidMap: { [key: string]: boolean } = {
  phone01: false,
  phone02: false,
};

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
    console.log('this.logingRole', this.logingRole)

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

  ngOnInit(): void {
    this.loadBanks()
    this.loadBranches()
    this.getAllDistributionCenters();
    // this.getLastID('COO');
    // this.EpmloyeIdCreate();
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
    console.log('personalData', this.personalData)
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
    // this.personalData.image = this.selectedFile;
    if (this.personalData.accNumber !== this.personalData.conformAccNumber) {
      return;
    }
    this.isLoading = true;
    // this.isAppireImgValidation = true;

    // this.vehicleSideBImageFile
    if (!this.personalData.accHolderName || !this.personalData.accNumber || !this.personalData.bankName || !this.personalData.branchName) {
      this.isLoading = false;
      this.toastSrv.warning('Pleace fill all required bank details feilds')
      return;

    } else {
      if (this.logingRole === 'Distribution Center Manager') {
        console.log('Distribution Center Manager')
        this.DistributedManageOfficerSrv.createDistributionOfficerDIO(this.personalData, this.selectedImage).subscribe(
          (res: any) => {
            if (res.status) {
              this.officerId = res.officerId;
              this.isLoading = false;
              this.toastSrv.success('Ditribution Officer Created Successfully')
              this.router.navigate(['/distribution-officers'])
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
      } else if (this.logingRole === 'Distribution Center Head') {
        console.log('Distribution Center Head')

       
        this.DistributedManageOfficerSrv.createDistributionOfficer(this.personalData, this.selectedImage).subscribe(
          (res: any) => {
            if (res.status) {
              this.officerId = res.officerId;
              this.isLoading = false;
              this.toastSrv.success('Distribution Officer Created Successfully')
              this.router.navigate(['/distribution-officers'])
            } else {
              this.isLoading = false;
              // this.toastSrv.error('There was an error creating the collective officer')
              this.toastSrv.error(res.message)


            }
          },
          (error: any) => {
            this.isLoading = false;
            this.toastSrv.error('There was an error creating the Distribution officer')
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
      title: 'Are you sure?',
      text: 'Do you really want to cancel this form?',
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

  getAllDistributionCenters() {
    this.isLoading = true;
    this.DistributedManageOfficerSrv.getDCHOwnCenters().subscribe(
      (res) => {
        this.centerArr = res
        console.log('centerArr', this.centerArr)
        this.isLoading = false;

      }
    )
  }

  getAllDistributionManagers() {
    this.isLoading = true;
    // this.personalData.jobRole = ''
    this.DistributedManageOfficerSrv.getDistributionCenterManagers(this.personalData.centerId).subscribe(
      (res) => {
        this.managerArr = res
        console.log('managerArr', this.managerArr)
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

  // Validation for pageOne fields
  // if (!this.personalData.empType) {
  //   missingFields.push('Staff Employee Type');
  // }

  if (!this.personalData.centerId && this.logingRole === 'Distribution Center Head') {
    missingFields.push('Distribution Centre Name is required');
  }

  if (!this.personalData.irmId && this.logingRole === 'Distribution Center Head') {
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

  onBankChange() {
    if (this.selectedBankId) {
      // Update branches based on selected bank
      this.branches = this.allBranches[this.selectedBankId.toString()] || [];

      // Update company data with bank name
      const selectedBank = this.banks.find(bank => bank.ID === this.selectedBankId);
      if (selectedBank) {
        this.personalData.bankName = selectedBank.name;
        this.invalidFields.delete('bankName');
      }

      // Reset branch selection
      this.selectedBranchId = null;
      this.personalData.branchName = '';
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

  jobRole: string = 'Distribution Officer'
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
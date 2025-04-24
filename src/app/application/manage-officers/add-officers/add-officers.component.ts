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


@Component({
  selector: 'app-add-officers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './add-officers.component.html',
  styleUrl: './add-officers.component.css'
})
export class AddOfficersComponent implements OnInit {

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

  invalidFields: Set<string> = new Set();


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





  constructor(
    private ManageOficerSrv: ManageOfficersService,
    private router: Router,
    private toastSrv: ToastAlertService,
    private tokenSrv: TokenServiceService,
    private http: HttpClient,
    private location: Location


  ) {
    this.logingRole = tokenSrv.getUserDetails().role

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
    this.loadBanks()
    this.loadBranches()
    this.getAllCenters();
    this.getLastID('COO');
    this.EpmloyeIdCreate();
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

  getLastID(role: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.ManageOficerSrv.getForCreateId(role).subscribe(
        (res) => {
          this.lastID = res.result.empId;
          const lastId = res.result.empId;
          resolve(lastId); // Resolve the Promise with the empId
        },
        (error) => {
          console.error('Error fetching last ID:', error);
          reject(error);
        }
      );
    });
  }

  EpmloyeIdCreate() {
    let rolePrefix: string;
    if (this.personalData.jobRole === 'Collection Center Manager') {
      rolePrefix = 'CCM';
    } else if (this.personalData.jobRole === 'Customer Officer') {
      rolePrefix = 'CUO';
    } else if (this.personalData.jobRole === 'Driver') {
      rolePrefix = 'DVR';
    } else {
      rolePrefix = 'COO';
    }

    this.getLastID(rolePrefix).then((lastID) => {
      this.personalData.empId = rolePrefix + lastID;
    });
  }

  updateProvince(event: Event): void {
    const target = event.target as HTMLSelectElement; // Cast to HTMLSelectElement
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


    if (!this.personalData.accHolderName || !this.personalData.accNumber || !this.personalData.bankName || !this.personalData.branchName) {
      this.isLoading = false;
      this.toastSrv.warning('Pleace fill all required feilds')

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
          if (!this.licenseFrontImageFileName|| !this.licenseBackImageFileName || !this.insurenceFrontImageFileName || !this.insurenceBackImageFileName || !this.vehicleFrontImageFileName || !this.vehicleBackImageFileName || !this.vehicleSideAImageFileName || !this.vehicleSideBImageFileName) {
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

  getAllCenters() {
    this.isLoading = true;
    this.ManageOficerSrv.getCCHOwnCenters().subscribe(
      (res) => {
        this.centerArr = res
        this.isLoading = false;

      }
    )
  }

  getAllManagers() {
    this.isLoading = true;
    this.ManageOficerSrv.getCenterManagers(this.personalData.centerId).subscribe(
      (res) => {
        this.managerArr = res
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
  }


  loadBanks() {
    this.http.get<Bank[]>('assets/json/banks.json').subscribe(
      data => {
        this.banks = data;

      },
      error => {
        console.error('Error loading banks:', error);
      }
    );
  }

  loadBranches() {
    this.http.get<BranchesData>('assets/json/branches.json').subscribe(
      data => {
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
  irmId: number | string = '';
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
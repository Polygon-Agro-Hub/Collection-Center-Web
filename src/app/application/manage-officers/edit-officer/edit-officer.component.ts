import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-officer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './edit-officer.component.html',
  styleUrl: './edit-officer.component.css'
})
export class EditOfficerComponent implements OnInit {
  personalData: Personal = new Personal();
  // ManagerArr!: ManagerDetails[]
  centerArr: Center[] = [];
  managerArr: Manager[] = [];



  languages: string[] = ['Sinhala', 'English', 'Tamil'];
  selectedPage: 'pageOne' | 'pageTwo' = 'pageOne';
  lastID!: number
  itemId: number | null = null;
  officerId!: number
  editOfficerId!: number
  selectJobRole!: string
  UpdatelastID!: string
  upateEmpID!: string
  selectedLanguages: string[] = [];



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


  constructor(
    private ManageOficerSrv: ManageOfficersService,
    private router: Router,
    private route: ActivatedRoute,
    private toastSrv: ToastAlertService,
    private tokenSrv: TokenServiceService,
    private http: HttpClient,

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


  ngOnInit(): void {
    // this.getAllCollectionCetnter();
    this.loadBanks();
    this.loadBranches();
    this.getAllCenters();
    this.editOfficerId = this.route.snapshot.params['id'];
    this.fetchOffierById(this.editOfficerId);
    this.UpdateEpmloyeIdCreate();
  }

  fetchOffierById(id: number) {
    this.isLoading = true;
    this.ManageOficerSrv.getOfficerById(id).subscribe(
      (res: any) => {
        console.log(res.officerData.collectionOfficer);

        this.personalData = res.officerData.collectionOfficer;
        this.ExistirmId = res.officerData.irmId;

        this.getUpdateLastID(res.officerData.collectionOfficer.jobRole);
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


        this.UpdateEpmloyeIdCreate();
        // this.getAllmanagers();
        this.matchExistingBankToDropdown();
        this.isLoading = false;

      }
    );
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


  UpdateEpmloyeIdCreate() {
    let rolePrefix: string | undefined;

    // Map job roles to their respective prefixes
    if (this.personalData.jobRole === 'Collection Center Manager') {
      rolePrefix = 'CCM';
    } else if (this.personalData.jobRole === 'Customer Officer') {
      rolePrefix = 'CUO';

    } else {
      rolePrefix = 'COO';

    }


    if (!rolePrefix) {
      console.error(`Invalid job role: ${this.personalData.jobRole}`);
      return;
    }


    this.getUpdateLastID(rolePrefix)
      .then((lastId) => {
        this.upateEmpID = rolePrefix + lastId;

      })
      .catch((error) => {
        console.error('Error fetching updated last ID:', error);
      });
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
  }


  nextForm(page: 'pageOne' | 'pageTwo') {
    if (!this.personalData.firstNameEnglish || !this.personalData.firstNameSinhala || !this.personalData.firstNameTamil || !this.personalData.email || !this.personalData.languages || !this.personalData.lastNameEnglish || !this.personalData.lastNameSinhala || !this.personalData.lastNameTamil || !this.personalData.nic || !this.personalData.phoneNumber01 || !this.personalData.phoneCode01) {
      Swal.fire('warning', 'Pleace fill all required feilds', 'warning')
    } else {
      this.selectedPage = page;
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
      // this.officerForm.patchValue({ image: file });

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

    this.personalData.empId = this.upateEmpID;

    if (!this.personalData.accHolderName || !this.personalData.accNumber || !this.personalData.bankName || !this.personalData.branchName || !this.personalData.city || !this.personalData.country || !this.personalData.district || !this.personalData.houseNumber) {
      this.toastSrv.warning('Pleace fill all required feilds')


    } else {
      this.isLoading = true;

      if (this.logingRole === 'Collection Center Manager') {
        this.ManageOficerSrv.updateCollectiveOfficer(this.personalData, this.editOfficerId, this.selectedImage).subscribe(
          (res: any) => {
            this.officerId = res.officerId;
            this.isLoading = false;
            this.toastSrv.success('Collective Officer Updated Successfully')
            this.router.navigate(['/manage-officers/view-officer'])
          },
          (error: any) => {
            this.isLoading = false;
            this.toastSrv.error('There was an error creating the collective officer')

          }
        );
      } else if (this.logingRole === 'Collection Center Head') {
        if (this.personalData.jobRole === 'Collection Center Manager') {
          this.personalData.irmId = null;
        }
        this.ManageOficerSrv.CCHupdateCollectiveOfficer(this.personalData, this.editOfficerId, this.selectedImage).subscribe(
          (res: any) => {
            this.officerId = res.officerId;
            this.isLoading = false;
            this.toastSrv.success('Collective Officer Updated Successfully')
            this.router.navigate(['/manage-officers/view-officer'])
          },
          (error: any) => {
            this.isLoading = false;
            this.toastSrv.error('There was an error creating the collective officer')

          }
        );
      }



    }
  }

  onCancel() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to clear this form?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clear it!',
      cancelButtonText: 'Cancel',
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
        // this.personalData = new Bank();
        // this.personalData = new Company();
        this.toastSrv.error('The form has been cleared.')

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
        console.log(res);

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
    console.log("matchExistingBankToDropdown",this.banks.length, this.allBranches);
    
    // Only proceed if both banks and branches are loaded and we have existing data
    if (this.banks.length > 0 && Object.keys(this.allBranches).length > 0 &&
      this.personalData && this.personalData.bankName) {
      console.log('hit 01', this.personalData.bankName);

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
    console.log('hit 02');
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

  jobRole: string = 'Collection Officer'
  empId!: string
  employeeType!: string;

  image!: any

  previousQR!: string
  previousImage!: string


  centerId: number | string = '';
  irmId: number | string | null = '';

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





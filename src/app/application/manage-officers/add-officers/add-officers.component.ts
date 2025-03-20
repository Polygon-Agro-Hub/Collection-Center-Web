import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { Router } from '@angular/router';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

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



  languages: string[] = ['Sinhala', 'English', 'Tamil'];
  selectedPage: 'pageOne' | 'pageTwo' = 'pageOne';
  lastID!: number
  itemId: number | null = null;
  officerId!: number


  selectedFileName!: string
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  logingRole: string | null = null;
  languagesRequired: boolean = false;

  isLoading: boolean = false;




  constructor(
    private ManageOficerSrv: ManageOfficersService,
    private router: Router,
    private toastSrv: ToastAlertService,
    private tokenSrv: TokenServiceService
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


  // onCheckboxChange(lang: string, event: any) {
  //     if (event.target.checked) {
  //         if (!this.personalData.languages) {
  //             this.personalData.languages = lang;
  //         } else if (!this.personalData.languages.includes(lang)) {
  //             this.personalData.languages += `,${lang}`;
  //         }
  //     } else {
  //         const languagesArray = this.personalData.languages.split(',');
  //         const index = languagesArray.indexOf(lang);
  //         if (index !== -1) {
  //             languagesArray.splice(index, 1);
  //         }
  //         this.personalData.languages = languagesArray.join(',');
  //     }

  //     // Validate when a change occurs
  //     this.validateLanguages();
  // }

  validateLanguages() {
    this.languagesRequired = !this.personalData.languages || this.personalData.languages.trim() === '';
  }


  nextForm(page: 'pageOne' | 'pageTwo') {
    // if (!this.personalData.centerId || !this.personalData.firstNameEnglish || !this.personalData.firstNameSinhala || !this.personalData.firstNameTamil || !this.personalData.city || !this.personalData.country || !this.personalData.district || !this.personalData.email || !this.personalData.houseNumber || !this.personalData.languages || !this.personalData.lastNameEnglish || !this.personalData.lastNameSinhala || !this.personalData.lastNameTamil || !this.personalData.nic || !this.personalData.phoneNumber01) {
    //   Swal.fire('warning', 'Pleace fill all required feilds', 'warning')
    // } else {
    //   this.selectedPage = page;
    // }

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
              this.router.navigate(['/manage-officers/view-officer'])
            } else {
              this.isLoading = false;
              this.toastSrv.error('There was an error creating the collective officer')

            }
          },
          (error: any) => {
            this.isLoading = false;
            this.toastSrv.error('There was an error creating the collective officer')
          }
        );
      } else if (this.logingRole === 'Collection Center Head') {
        this.ManageOficerSrv.CCHcreateCollectiveOfficer(this.personalData, this.selectedImage).subscribe(
          (res: any) => {
            if (res.status) {
              this.officerId = res.officerId;
              this.isLoading = false;
              this.toastSrv.success('Collective Officer Created Successfully')
              this.router.navigate(['/manage-officers/view-officer'])
            } else {
              this.isLoading = false;
              this.toastSrv.error('There was an error creating the collective officer')

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
      text: 'Do you really want to clear this form?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clear it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.personalData = new Personal();
        this.toastSrv.success('The form has been cleared.')
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





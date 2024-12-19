import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-officer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-officer.component.html',
  styleUrl: './edit-officer.component.css'
})
export class EditOfficerComponent implements OnInit {
  personalData: Personal = new Personal();
  bankData: Bank = new Bank();
  companyData: Company = new Company();
  collectionCenterData: CollectionCenter[] = []
  ManagerArr!: ManagerDetails[]


  languages: string[] = ['Sinhala', 'English', 'Tamil'];
  selectedPage: 'pageOne' | 'pageTwo' = 'pageOne';
  isLoading = false;
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

  constructor(
    private ManageOficerSrv: ManageOfficersService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

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
    this.getAllCollectionCetnter();
    this.editOfficerId = this.route.snapshot.params['id'];
    this.fetchOffierById(this.editOfficerId);
    this.UpdateEpmloyeIdCreate();
  }

  fetchOffierById(id: number) {
    this.ManageOficerSrv.getOfficerById(id).subscribe(
      (res: any) => {
        this.personalData = res.officerData.collectionOfficer;
        this.bankData = res.officerData.bankDetails;
        this.companyData = res.officerData.companyDetails;
        this.getUpdateLastID(res.officerData.companyDetails.jobRole);
  
        // Initialize languages as a comma-separated string if it's not already in that format
        if (Array.isArray(this.personalData.languages)) {
          this.personalData.languages = this.personalData.languages.join(',');
        } else if (!this.personalData.languages) {
          this.personalData.languages = '';
        }
  
        this.selectJobRole = res.officerData.companyDetails.jobRole;
        console.log(res.officerData.companyDetails.empId, "empid");
  
        this.UpdateEpmloyeIdCreate();
        this.getAllmanagers();
      }
    );
  }
  

  getUpdateLastID(role: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.ManageOficerSrv.getForCreateId(role).subscribe(
        (res) => {
          let lastId;
          if (this.selectJobRole === this.companyData.jobRole) {
            lastId = this.companyData.empId;
            this.UpdatelastID = lastId;
            console.log(lastId);

          } else {
            this.UpdatelastID = res.result.empId;
            lastId = res.result.empId
            console.log(lastId);

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
    if (this.companyData.jobRole === 'Collection Center Manager') {
      rolePrefix = 'CCM';
    } else if (this.companyData.jobRole === 'Customer Officer') {
      rolePrefix = 'CUO';
    } else {
      rolePrefix = 'COO';
    }


    if (!rolePrefix) {
      console.error(`Invalid job role: ${this.companyData.jobRole}`);
      return;
    }


    this.getUpdateLastID(rolePrefix)
      .then((lastId) => {
        this.upateEmpID = rolePrefix + lastId;
        console.log("Updated EMP ID:", this.upateEmpID);
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
    if (!this.personalData.centerId || !this.personalData.firstNameEnglish || !this.personalData.firstNameSinhala || !this.personalData.firstNameTamil || !this.personalData.city || !this.personalData.country || !this.personalData.district || !this.personalData.email || !this.personalData.houseNumber || !this.personalData.languages || !this.personalData.lastNameEnglish || !this.personalData.lastNameSinhala || !this.personalData.lastNameTamil || !this.personalData.nic || !this.personalData.phoneNumber01) {
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
        Swal.fire('Error', 'File size should not exceed 5MB', 'error');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire('Error', 'Only JPEG, JPG and PNG files are allowed', 'error');
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

  getAllCollectionCetnter() {
    this.ManageOficerSrv.getAllCollectionCenter().subscribe(
      (res) => {
        this.collectionCenterData = res
      }
    )
  }

  onSubmit() {
    console.log(this.personalData); // Logs the personal data with updated languages
    console.log(this.bankData);
    console.log(this.companyData);
    this.companyData.empId = this.upateEmpID;
    if(this.companyData.jobRole === 'Collection Center Manager'){
      this.companyData.collectionManagerId = null;
    }

    if (!this.bankData.accHolderName || !this.bankData.accNumber || !this.bankData.bankName || !this.bankData.branchName || !this.companyData.assignedDistrict || !this.companyData.companyEmail || !this.companyData.companyNameEnglish || !this.companyData.companyNameSinhala || !this.companyData.companyNameTamil) {
      Swal.fire('warning', 'Pleace fill all required feilds', 'warning')

    } else {
      this.ManageOficerSrv.updateCollectiveOfficer(this.personalData, this.bankData, this.companyData, this.editOfficerId).subscribe(
        (res: any) => {
          this.officerId = res.officerId;
          Swal.fire('Success', 'Collective Officer Updated Successfully', 'success');
          this.router.navigate(['/manage-officers/view-officer'])
        },
        (error: any) => {
          Swal.fire('Error', 'There was an error creating the collective officer', 'error');
        }
      );

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
        this.bankData = new Bank();
        this.companyData = new Company();

        Swal.fire(
          'Cleared!',
          'The form has been cleared.',
          'success'
        );
      }
    });
  }

  getAllmanagers() {
    this.ManageOficerSrv.getAllManagersByCenter(this.personalData.centerId).subscribe(
      (res) => {
        this.ManagerArr = res.result
      }
    )
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
  password!: string;
  passwordUpdated!: string;
  houseNumber!: string;
  streetName!: string;
  city!: string;
  district!: string;
  province!: string;
  country: string = 'Sri Lanka';
  languages: string = '';
  centerId!: string
  image!: any
}

class Bank {
  accHolderName!: string;
  accNumber!: string;
  bankName!: string;
  branchName!: string;
}

class Company {
  companyNameEnglish!: string;
  companyNameSinhala!: string;
  companyNameTamil!: string;
  jobRole: string = 'Collection Officer'
  empId!: string
  IRMname!: string;
  companyEmail!: string;
  assignedDistrict!: string;
  employeeType!: string;
  collectionManagerId: string | null = ''
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


import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';

@Component({
  selector: 'app-add-officers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-officers.component.html',
  styleUrl: './add-officers.component.css'
})
export class AddOfficersComponent implements OnInit {

  personalData: Personal = new Personal();
  bankData: Bank = new Bank();
  companyData: Company = new Company();
  collectionCenterData: CollectionCenter[] = []


  languages: string[] = ['Sinhala', 'English', 'Tamil'];
  selectedPage: 'pageOne' | 'pageTwo' = 'pageOne';
  isLoading = false;
  lastID!:number
  itemId: number | null = null;


  selectedFileName!: string
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private ManageOficerSrv: ManageOfficersService) { }

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
    throw new Error('Method not implemented.');
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

  EpmloyeIdCreate() {
    let rolePrefix: string;

    if (this.companyData.jobRole === 'Collection Center Head') {
      rolePrefix = 'CCH';
    } else if (this.companyData.jobRole === 'Collection Center Manager') {
      rolePrefix = 'CCM';
    } else if (this.companyData.jobRole === 'Customer Officer') {
      rolePrefix = 'CUO';
    } else {
      rolePrefix = 'COO';
    }



    // this.getLastID(rolePrefix).then((lastID) => {
    //   this.companyData.empId = rolePrefix + lastID;
    // });
  }

  updateProvince(event: Event): void {
    const target = event.target as HTMLSelectElement; // Cast to HTMLSelectElement
    const selectedDistrict = target.value;
  
    const selected = this.districts.find(district => district.name === selectedDistrict);

    if(this.itemId === null){

      if (selected) {
        this.personalData.province = selected.province;
      } else {
        this.personalData.province = ''; 
      }

    }
   
  }

  getAllCollectionCetnter() {
    // this.ManageOficerSrv.getAllCollectionCenter().subscribe(
    //   (res) => {
    //     this.collectionCenterData = res
    //   }
    // )
  }

  onSubmit() {
    console.log(this.personalData); // Logs the personal data with updated languages
    console.log(this.bankData);
    console.log(this.companyData);

    // const formValue = this.officerForm.value;

    // const formData = new FormData();
    // if (this.officerForm.value) {
    //   const officerData = this.officerForm.value;
    //   for (const key in officerData) {
    //     if (officerData.hasOwnProperty(key)) {
    //       formData.append(key, officerData[key]);
    //     }
    //   }

    // this.personalData.image = this.selectedFile

    // this.collectionOfficerService.createCollectiveOfficer(this.personalData, this.bankData, this.companyData).subscribe(
    //   (res: any) => {
    //     this.officerId = res.officerId;
    //     Swal.fire('Success', 'Collective Officer Created Successfully', 'success');
    //     this.router.navigate(['/steckholders/collective-officer'])
    //   },
    //   (error: any) => {
    //     Swal.fire('Error', 'There was an error creating the collective officer', 'error');
    //   }
    // );
    // }
  }




}


class Personal {
  firstNameEnglish!: string;
  firstNameSinhala!: string;
  firstNameTamil!: string;
  lastNameEnglish!: string;
  lastNameSinhala!: string;
  lastNameTamil!: string;
  phoneNumber01Code!: string;
  phoneNumber01!: string;
  phoneNumber02Code!: string;
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
}

class CollectionCenter {
  id!: number
  centerName!: string

}


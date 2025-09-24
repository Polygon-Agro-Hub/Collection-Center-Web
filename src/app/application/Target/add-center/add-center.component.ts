import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { TargetService } from '../../../services/Target-service/target.service'
import Swal from 'sweetalert2';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { Location } from '@angular/common';
import { Country, COUNTRIES } from '../../../../assets/country-data';

@Component({
  selector: 'app-add-center',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './add-center.component.html',
  styleUrl: './add-center.component.css'
})
export class AddCenterComponent implements OnInit {

  @ViewChild('centerForm') centerForm!: NgForm;

  centerData: CenterData = new CenterData();

  isLoading: boolean = false;

  isLoadingregcode: boolean = false;


  provinces: string[] = [
    'Western',
    'Central',
    'Southern',
    'Northern',
    'Eastern',
    'North Western',
    'North Central',
    'Uva',
    'Sabaragamuwa'
  ];

  allowedPrefixes = ['70', '71', '72', '75', '76', '77', '78'];
  isPhoneInvalidMap: { [key: string]: boolean } = {
  phone01: false,
  phone02: false,
};

  // Define all districts with their provinces
  allDistricts = [
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

  // Districts filtered by selected province
  filteredDistricts: { name: string, province: string }[] = [];

  countries: Country[] = COUNTRIES;
  selectedCountry1: Country | null = null;
  selectedCountry2: Country | null = null;

  dropdownOpen = false;
  dropdownOpen2 = false;

  constructor(
    private router: Router,
    private toastSrv: ToastAlertService,
    private targetService: TargetService,
    private location: Location
  ) {
    const defaultCountry = this.countries.find(c => c.code === 'lk') || null;
    this.selectedCountry1 = defaultCountry;
    this.selectedCountry2 = defaultCountry;
  }

  ngOnInit(): void {
    this.updateFilteredDistricts(); // Initialize filtered districts
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

selectCountry1(country: Country) {
  this.selectedCountry1 = country;
  this.centerData.phoneNumber01Code = country.dialCode; // update ngModel
  console.log('sdsf', this.centerData.phoneNumber01Code)
  this.dropdownOpen = false;
}

selectCountry2(country: Country) {
  this.selectedCountry2 = country;
  this.centerData.phoneNumber02Code = country.dialCode; // update ngModel
  console.log('sdsf', this.centerData.phoneNumber02Code)
  this.dropdownOpen2 = false;
}

// get flag
getFlagUrl(code: string): string {
  return `https://flagcdn.com/24x18/${code}.png`;
}

  // Update the filtered districts based on selected province
  updateFilteredDistricts() {
    if (this.centerData.province) {
      this.filteredDistricts = this.allDistricts.filter(d => d.province === this.centerData.province);
    } else {
      this.filteredDistricts = this.allDistricts;
    }
    this.centerData.district = ''; // Clear district selection when province changes
    this.updateRegCode();
  }

  

  // When district is selected, automatically set the province
  filterDistrict() {
    if (this.centerData.district) {
      const selectedDistrict = this.allDistricts.find(d => d.name === this.centerData.district);
      if (selectedDistrict) {
        // Update the province based on the selected district
        this.centerData.province = selectedDistrict.province;

        // Update filtered districts for the selected province
        this.filteredDistricts = this.allDistricts.filter(d => d.province === this.centerData.province);
      }
    }
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

  onTrimInput(event: Event, modelRef: any, fieldName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const trimmedValue = inputElement.value.trimStart();
    modelRef[fieldName] = trimmedValue;
    inputElement.value = trimmedValue;
  }

  capitalizeFirstLetter(field: keyof CenterData) {
    if (this.centerData[field]) {
      let value = this.centerData[field] as unknown as string;
  
      // Trim spaces
      value = value.trim();
  
      // Capitalize first letter
      value = value.charAt(0).toUpperCase() + value.slice(1);
  
      this.centerData[field] = value as never; // assign back safely
    }
  }

  onSubmit(form: NgForm) {
    Object.values(this.centerForm.controls).forEach(control => {
      control.markAsTouched();
    });

    const missingFields: string[] = [];

    if (!this.centerData.centerName) {
      missingFields.push('Collection Centre Name is required');
    }

    if (!this.centerData.phoneNumber01) {
      missingFields.push('Contact Number - 1 is required');
    } else if (!/^[0-9]{9}$/.test(this.centerData.phoneNumber01) || this.isPhoneInvalidMap['phone01']) {
      missingFields.push('Contact Number - 1 - Must be a valid 9-digit number (format: +947XXXXXXXX)');
    }
  
    if (this.centerData.phoneNumber02) {
      if (!/^[0-9]{9}$/.test(this.centerData.phoneNumber02) || this.isPhoneInvalidMap['phone02']) {
        missingFields.push('Contact Number - 2 - Must be a valid 9-digit number (format: +947XXXXXXXX)');
      }
      if (this.centerData.phoneNumber01 === this.centerData.phoneNumber02) {
        missingFields.push('Contact Number - 2 - Must be different from Contact Number - 1');
      }
    }

    if (!this.centerData.province) {
      missingFields.push('Province is required');
    }

    if (!this.centerData.district) {
      missingFields.push('District is required');
    }

    if (!this.centerData.buildingNumber) {
      missingFields.push('Building Number is required');
    }

    if (!this.centerData.street) {
      missingFields.push('Street Name is required');
    }

    if (!this.centerData.city) {
      missingFields.push('City is required');
    }

    if (!this.centerData.regCode) {
      missingFields.push('Registration Code is required');
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

    this.isLoading = true;

    // Validate form data
    if (
      !this.centerData ||
      !this.centerData.centerName ||
      !this.centerData.district ||
      !this.centerData.country ||
      !this.centerData.street ||
      !this.centerData.city ||
      !this.centerData.buildingNumber
    ) {
      this.isLoading = false;
      this.toastSrv.warning('Please fill all required fields');
      return;
    }

    // Call the service to create a center
    this.targetService.createCenter(this.centerData).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toastSrv.success('Centre Created Successfully');
          this.router.navigate(['/centers']);
        } else {
          this.toastSrv.error(res.message || 'There was an error creating the Centre');
        }
      },
      error: (error: any) => {
        this.isLoading = false;

        // Handle different types of errors based on error status or message
        if (error.status === 400) {
          // Validation error or bad request
          const errorMessage =
            error?.error?.message ||
            'Invalid input. Please check the data and try again.';
          this.toastSrv.error(errorMessage);
        } else if (error.status === 409) {
          // Conflict error, e.g., duplicate regCode
          const errorMessage =
            error?.error?.message ||
            'A Centre with this registration code already exists.';
          this.toastSrv.error(errorMessage);
        } else if (error.status === 500) {
          // Server error
          this.toastSrv.error('An internal server error occurred. Please try again later.');
        } else {
          // Generic error
          const errorMessage =
            error?.error?.message ||
            'There was an error creating the Centre. Please try again.';
          this.toastSrv.error(errorMessage);
        }
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onCancel() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to clear this form?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, Stay On Page',
      customClass: {
        popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
        title: 'dark:text-white',

        icon: '',
        confirmButton: 'hover:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500 dark:focus:ring-red-800',
        cancelButton: 'hover:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-blue-800',
        actions: 'gap-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {

        this.toastSrv.warning('Centre Add Operation Canceled.')
        this.location.back();
      }
    });
  }

  updateRegCode() {
    console.log('update reg code');
    const province = this.centerData.province;
    const district = this.centerData.district;
    const city = this.centerData.city;

    console.log('province', province, 'district', district, 'city', city);

    if (province && district && city) {
      this.isLoadingregcode = true;
      this.targetService
        .generateRegCode(province, district, city)
        .subscribe({
          next: (response) => {
            this.centerData.regCode = response.regCode;
            this.isLoadingregcode = false;
          },
          error: (error) => {
            console.error('Error generating reg code:', error);
            // Fallback to manual generation if API fails
            const regCode = `${province.slice(0, 2).toUpperCase()}${district
              .slice(0, 1)
              .toUpperCase()}${city.slice(0, 1).toUpperCase()}`;
            console.log('regCode fallback', regCode);
            this.centerData.regCode = '';
            this.isLoadingregcode = false;
          }
        });
    }
  }

  onCityChange() {
    // Update reg code when city changes
    this.updateRegCode();
  }

  onDistrictChange(newDistrict: string) {
    console.log('District changed to:', newDistrict);
    this.updateRegCode();
  }

}

class CenterData {
  centerName!: string;
  district!: string;
  province!: string;
  country: string = 'Sri Lanka'
  buildingNumber!: string;
  street!: string;
  city!: string;
  regCode!: string;
  phoneNumber01Code: string = '+94';
  phoneNumber01!: string;
  phoneNumber02Code: string = '+94';
  phoneNumber02!: string

}
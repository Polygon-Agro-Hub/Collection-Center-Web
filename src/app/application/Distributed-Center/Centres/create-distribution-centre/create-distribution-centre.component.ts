import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild  } from '@angular/core';
import { FormsModule, NgForm  } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';
import Swal from 'sweetalert2';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { Location } from '@angular/common';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service';
import { SerchableDropdownComponent } from '../../../../components/serchable-dropdown/serchable-dropdown.component';
import { Country, COUNTRIES } from '../../../../../assets/country-data';

@Component({
  selector: 'app-create-distribution-centre',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, SerchableDropdownComponent],
  templateUrl: './create-distribution-centre.component.html',
  styleUrl: './create-distribution-centre.component.css'
})
export class CreateDistributionCentreComponent implements OnInit {

  @ViewChild('centerForm') centerForm!: NgForm;
  centerData: CenterData = new CenterData();
  isLoadingregcode: boolean = false;
  isLoading: boolean = false;

  itemId: number | null = null;

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

  // Define all districts with their provinces
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


  constructor(
    private router: Router,
    private toastSrv: ToastAlertService,
    private DistributionService: DistributionServiceService,
    private location: Location
  ) { 
    const defaultCountry = this.countries.find(c => c.code === 'lk') || null;
    this.selectedCountry1 = defaultCountry;
    this.selectedCountry2 = defaultCountry;
  }

  ngOnInit(): void {
  }

  @HostListener('document:click', ['$event.target'])
onClick(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return; // exit if not an element

  const insideDropdown1 = target.closest('.dropdown-wrapper-1');
  const insideDropdown2 = target.closest('.dropdown-wrapper-2');

  if (!insideDropdown1) this.dropdownOpen = false;
  if (!insideDropdown2) this.dropdownOpen2 = false;
}

selectCountry1(country: Country) {
  this.selectedCountry1 = country;
  this.centerData.phoneNumber01Code = country.dialCode; 
  this.dropdownOpen = false;
}

selectCountry2(country: Country) {
  this.selectedCountry2 = country;
  this.centerData.phoneNumber02Code = country.dialCode; 
  this.dropdownOpen2 = false;
}

// get flag
getFlagUrl(code: string): string {
  return `https://flagcdn.com/24x18/${code}.png`;
}

  updateRegCode() {
    const province = this.centerData.province;
    const district = this.centerData.district;
    const city = this.centerData.city;

    if (province && district && city) {
      this.isLoadingregcode = true;
      this.DistributionService
        .generateRegCode(province, district, city)
        .subscribe({
          next: (response) => {
            this.centerData.regCode = `D-${response.regCode}`;
            this.isLoadingregcode = false;
          },
          error: (error) => {
            console.error('Error generating reg code:', error);
            // Fallback to manual generation if API fails
            const regCode = `${province.slice(0, 2).toUpperCase()}${district
              .slice(0, 1)
              .toUpperCase()}${city.slice(0, 1).toUpperCase()}`;
            this.centerData.regCode = '';
            this.isLoadingregcode = false;
          }
        });
    }
  }

  onCityChange() {
    this.updateRegCode();
  }

  onDistrictChange(districtName: string | null) {
    if (this.itemId !== null) return; // keep your original guard

    const selected = this.districts.find(d => d.name === districtName || '');
    this.centerData.province = selected ? selected.province : '';

    this.updateRegCode();
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

  onSubmit(form: NgForm) {

    Object.values(this.centerForm.controls).forEach(control => {
      control.markAsTouched();
    });

    const missingFields: string[] = [];

    if (!this.centerData.DistributionCenterName) {
      missingFields.push('Distribution Centre Name is required');
    }

    if (!this.centerData.phoneNumber01) {
      missingFields.push('Contact Number - 01 is required');
    } else if (!/^[0-9]{9}$/.test(this.centerData.phoneNumber01) || this.isPhoneInvalidMap['phone01']) {
      missingFields.push('Contact Number - 01 - Must be a valid 9-digit number (format: +947XXXXXXXX)');
    }
  
    if (this.centerData.phoneNumber02) {
      if (!/^[0-9]{9}$/.test(this.centerData.phoneNumber02) || this.isPhoneInvalidMap['phone02']) {
        missingFields.push('Contact Number - 02 - Must be a valid 9-digit number (format: +947XXXXXXXX)');
      }
      if (this.centerData.phoneNumber01 === this.centerData.phoneNumber02) {
        missingFields.push('Contact Number - 02 - Must be different from Contact Number - 01');
      }
    }

    if (!this.centerData.latitude) {
      missingFields.push('Latitude is required');
    }

    if (!this.centerData.longitude) {
      missingFields.push('Longitude is required');
    }

    if (!this.centerData.province) {
      missingFields.push('Province is required');
    }

    if (!this.centerData.district) {
      missingFields.push('District is required');
    }

    if (!this.centerData.streetName) {
      missingFields.push('Street Name is required');
    }

    if (!this.centerData.city) {
      missingFields.push('City is required');
    }

    if (!this.centerData.email) {
      missingFields.push('Email is required');
    } else if (!/^[A-Za-z0-9](?!.*\.\.)([A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(this.centerData.email)) {
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

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create this distribution centre?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Create it!',
      cancelButtonText: 'No, Cancel',
      customClass: {
        popup: 'bg-tileLight dark:bg-tileBlack text-black dark:text-white',
        title: 'font-semibold text-lg',
      },
    }).then((result) => {
      if (result.isConfirmed) {
this.isLoading = true;

    // Call the service to create a center
    this.DistributionService.createDistributionCenter(this.centerData).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toastSrv.success('Distribution Centre Created Successfully');
          this.router.navigate(['/distribution-center']);
        } else {
          this.toastSrv.error(res.message || 'There was an error creating the Distribution Centre');
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
            'A Distribution Centre with this registration code already exists.';
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
    })
  }

  onCancel() {
      Swal.fire({
        title: 'Are you sure?',
      text: 'You may lose the added data after canceling!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, cancel',
      cancelButtonText: 'No, Keep Editing',
        customClass: {
          popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
          title: 'dark:text-white',
          icon: '!border-gray-200 dark:!border-gray-500',
          confirmButton: 'rounded-lg hover:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500 dark:focus:ring-red-800',
          cancelButton: 'rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-blue-800',
          actions: 'gap-2'
        }
      }).then((result) => {
      if (result.isConfirmed) {

        this.toastSrv.warning('Distribution Centre Add Operation Canceled.')
        this.location.back();
      }
    });
    }


  // onCancel() {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You may lose the added data after canceling!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, cancel',
  //     cancelButtonText: 'No, Keep Editing',
  //     customClass: {
  //       popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
  //       title: 'dark:text-white',

  //       icon: '',
  //       confirmButton: 'hover:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500 dark:focus:ring-red-800',
  //       cancelButton: 'hover:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-blue-800',
  //       actions: 'gap-2'
  //     }
  //   }).then((result) => {
  //     if (result.isConfirmed) {

  //       this.toastSrv.warning('Distribution Centre Add Operation Canceled.')
  //       this.location.back();
  //     }
  //   });
  // }

  enforceLatitudeRange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseFloat(input.value);
  
    if (value > 90) {
      input.value = '90';
      this.centerData.latitude = 90;
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Latitude',
        text: 'Latitude cannot be greater than 90°.',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'bg-white dark:bg-[#363636] text-[#534E4E] dark:text-textDark',
          title: 'font-semibold text-lg',
          htmlContainer: 'text-center',
        },
      });
    } else if (value < -90) {
      input.value = '-90';
      this.centerData.latitude = -90;
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Latitude',
        text: 'Latitude cannot be less than -90°.',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'bg-white dark:bg-[#363636] text-[#534E4E] dark:text-textDark',
          title: 'font-semibold text-lg',
          htmlContainer: 'text-center',
        },
      });
    } else {
      this.centerData.latitude = parseFloat(input.value);
    }
  }

  enforceLongitudeRange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseFloat(input.value);
  
    if (value > 180) {
      input.value = '180';
      this.centerData.longitude = 180;
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Longitude',
        text: 'Longitude cannot be greater than 180.',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'bg-white dark:bg-[#363636] text-[#534E4E] dark:text-textDark',
          title: 'font-semibold text-lg',
          htmlContainer: 'text-center',
        },
      });
    } else if (value < -180) {
      input.value = '-180';
      this.centerData.longitude = -180;
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Longitude',
        text: 'Longitude cannot be less than -180.',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'bg-white dark:bg-[#363636] text-[#534E4E] dark:text-textDark',
          title: 'font-semibold text-lg',
          htmlContainer: 'text-center',
        },
      });
    } else {
      this.centerData.longitude = parseFloat(input.value);
    }
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

  onDistributionCenterNameKeydown(event: KeyboardEvent): void {
  const inputElement = event.target as HTMLInputElement;
  
  // If space is pressed and cursor is at the beginning, prevent it
  if (event.key === ' ' && inputElement.selectionStart === 0) {
    event.preventDefault();
  }
}
}

class CenterData {
  DistributionCenterName!: string;
  district!: string;
  province!: string;
  country: string = 'Sri Lanka';
  latitude!: number;
  longitude!: number;
  city!: string;
  regCode!: string;
  phoneNumber01Code: string = '+94';
  phoneNumber01!: string;
  phoneNumber02Code: string = '+94';
  phoneNumber02!: string;
  streetName!: string;
  email!: string

}

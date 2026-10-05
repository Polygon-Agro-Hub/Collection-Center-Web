import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';
import { TargetService } from '../../../../services/Target-service/target.service'
import Swal from 'sweetalert2';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { Location } from '@angular/common';
import { Country, COUNTRIES } from '../../../../../assets/country-data';
import { SerchableDropdownComponent } from '../../../../components/serchable-dropdown/serchable-dropdown.component';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service';


@Component({
  selector: 'app-edit-distribution-center',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, SerchableDropdownComponent],
  templateUrl: './edit-distribution-center.component.html',
  styleUrl: './edit-distribution-center.component.css'
})
export class EditDistributionCenterComponent implements OnInit {

  centerData: CenterData = new CenterData();

  isLoading: boolean = false;

  isLoadingregcode = false;
  originalRegCode = '';
  originalRegPrefix = '';
  private regCodeRequestId = 0;

  allowedPrefixes = ['70', '71', '72', '75', '76', '77', '78'];
  isPhoneInvalidMap: { [key: string]: boolean } = {
    phone01: false,
    phone02: false,
  };

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

  countries: Country[] = COUNTRIES;
  selectedCountry1: Country | null = null;
  selectedCountry2: Country | null = null;

  dropdownOpen = false;
  dropdownOpen2 = false;

  centreId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastSrv: ToastAlertService,
    private DistributionSrv: DistributionServiceService,
    private location: Location
  ) {
    const defaultCountry = this.countries.find(c => c.code === 'lk') || null;
    this.selectedCountry1 = defaultCountry;
    this.selectedCountry2 = defaultCountry;
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('centerId');
    this.centreId = idParam !== null ? Number(idParam) : null;
    this.fetchCentreData(this.centreId!)
  }

  get provinceItems() {
    return this.provinces.map(province => ({
      value: province,
      label: province
    }));
  }

  get districtItems() {
    const districts = this.centerData.province
      ? this.allDistricts.filter(d => d.province === this.centerData.province)
      : this.allDistricts;

    return districts.map(district => ({
      value: district.name,
      label: district.name
    }));
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

  fetchCentreData(centreId: number) {
    this.isLoading = true;
    this.DistributionSrv.getCentreDataById(centreId).subscribe(
      (res) => {
        this.isLoading = false;
        this.centerData = res.centreData[0];
        this.originalRegCode = this.centerData.regCode;
        this.originalRegPrefix = this.buildRegPrefix(
          this.centerData.province,
          this.centerData.district,
          this.centerData.city
        );
        this.isLoading = false;
      }
    );

  }
  onProvinceChange(selectedProvince: string | null): void {
    this.centerData.province = selectedProvince || '';
    if (!selectedProvince) {
      this.centerData.province = '';
    } else {
      // Check if current district is still valid for the selected province
      const isDistrictValid = this.allDistricts.some(d =>
        d.name === this.centerData.district && d.province === selectedProvince
      );
      if (!isDistrictValid) {
        this.centerData.district = '';
      }
    }
    this.updateRegCode();
  }

  // Handle district selection change
  onDistrictChange(selectedDistrict: string | null): void {
    this.centerData.district = selectedDistrict || '';

    if (selectedDistrict) {
      const district = this.allDistricts.find(d => d.name === selectedDistrict);
      if (district && district.province !== this.centerData.province) {
        this.centerData.province = district.province;
      }
    }

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

  onSubmitForm(form: NgForm) {

    form.form.markAllAsTouched();
    const missingFields: string[] = [];
    if (!this.centerData.centerName) {
      missingFields.push('Centre Name is required');
    }

    if (!this.centerData.country) {
      missingFields.push('Country is required');
    }

    if (!this.centerData.province) {
      missingFields.push('Province is required');
    }

    if (!this.centerData.district) {
      missingFields.push('District is required');
    }

    if (!this.centerData.latitude) {
      missingFields.push('Latitude is required');
    }

    if (!this.centerData.longitude) {
      missingFields.push('Longitude is required');
    }

    if (!this.centerData.city) {
      missingFields.push('City is required');
    }

    if (!this.centerData.regCode) {
      missingFields.push('Reg code is required');
    }

    if (!this.centerData.email) {
      missingFields.push('Email is required');
    } else if (!/^[a-zA-Z0-9](\.?[a-zA-Z0-9_%+-])*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.centerData.email)) {
      missingFields.push('Email - Must be in a valid format (format: example&#64;domain.com)');
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

  onSubmit() {
    this.isLoading = true;

    // Validate form data
    if (
      !this.centerData ||
      !this.centerData.centerName ||
      !this.centerData.district ||
      !this.centerData.country ||
      !this.centerData.city

    ) {
      this.isLoading = false;
      this.toastSrv.warning('Please fill all required fields');
      return;
    }
    // Call the service to create a center
    this.DistributionSrv.editCenter(this.centerData).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toastSrv.success('Centre Updated Successfully');
          this.location.back();
        } else {
          this.toastSrv.error(res.message || 'There was an error Updating the Centre');
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

  trimAndCapitalize(event: Event, field: keyof CenterData) {
    const input = event.target as HTMLInputElement;

    // Remove leading spaces
    let value = input.value.replace(/^\s+/, '');

    // Capitalize first letter
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    // Update input and model
    input.value = value;
    this.centerData[field] = value as never;
  }

  onTrimInput(event: Event, modelRef: any, fieldName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const trimmedValue = inputElement.value.trimStart();
    modelRef[fieldName] = trimmedValue;
    inputElement.value = trimmedValue;
  }

  onCityChange() {
    // Update reg code when city changes
    this.updateRegCode();
  }

  updateRegCode() {
    const province = this.centerData.province;
    const district = this.centerData.district;
    const city = this.centerData.city;
    const requestId = ++this.regCodeRequestId;
    if (province && district && city) {
      // Keep the existing code if the location still maps to the same prefix
      if (this.originalRegCode && this.buildRegPrefix(province, district, city) === this.originalRegPrefix) {
        this.centerData.regCode = this.originalRegCode;
        this.isLoadingregcode = false;
        return;
      }
      this.isLoadingregcode = true;
      this.DistributionSrv
        .generateRegCode(province, district, city)
        .subscribe({
          next: (response) => {
            // Ignore responses from outdated requests
            if (requestId !== this.regCodeRequestId) return;
            this.centerData.regCode = response.regCode;
            this.isLoadingregcode = false;
          },
          error: (error) => {
            if (requestId !== this.regCodeRequestId) return;
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

  buildRegPrefix(province: string, district: string, city: string): string {
    if (!province || !district || !city) return '';
    return `D-${province.slice(0, 2).toUpperCase()}${district
      .slice(0, 1)
      .toUpperCase()}${city.slice(0, 1).toUpperCase()}`;
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

        icon: '',
        confirmButton: 'hover:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500 dark:focus:ring-red-800',
        cancelButton: 'hover:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-blue-800',
        actions: 'gap-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {

        this.toastSrv.warning('Distribution Centre Edit Operation Canceled.')
        this.location.back();
      }
    });
  }

  enforceLatitudeRange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseFloat(input.value);

    if (value > 90) {
      input.value = '90';
      this.centerData.latitude = 90;
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Latitude',
        text: 'Latitude cannot be greater than 90.',
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
        text: 'Latitude cannot be less than -90.',
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
        title: 'Longitude Latitude',
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

}
class CenterData {
  id!: number;
  centerName!: string;
  district!: string;
  province!: string;
  country!: string;
  buildingNumber!: string;
  street!: string;
  city!: string;
  regCode!: string;
  phoneNumber01Code: string = '+94';
  phoneNumber01!: string;
  phoneNumber02Code: string = '+94';
  phoneNumber02!: string;
  email!: string;
  latitude!: number;
  longitude!: number;
}
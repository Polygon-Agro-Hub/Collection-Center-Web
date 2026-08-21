// view-centers.component.ts
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { DropdownModule } from 'primeng/dropdown';
import { TargetService } from '../../../services/Target-service/target.service'
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { AddCenterComponent } from '../add-center/add-center.component';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';

@Component({
    selector: 'app-view-centers',
    standalone: true,
    imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule, LoadingSpinnerComponent, SerchableDropdownComponent],
    templateUrl: './view-centers.component.html',
    styleUrl: './view-centers.component.css'
})
export class ViewCentersComponent implements OnInit {
    itemsArr!: CenterData[];
    searchText: string = '';
    selectProvince: string = '';
    selectDistrict: string = '';
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalItems: number = 0;
    countOfOfficers: number = 0;

    isLoading: boolean = true;
    hasData: boolean = false;

    // Define all Sri Lanka provinces
    isProvinceDropdownOpen = false;
    isDistrictDropdownOpen = false;

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

    constructor(
        private router: Router,
        private TargetSrv: TargetService,
    ) { }

    ngOnInit(): void {
        // this.updateFilteredDistricts();
        this.fetchAllCenterDetails();
    }

    // Convert arrays to dropdown items format
    get provinceItems() {
        return this.provinces.map(province => ({
            value: province,
            label: province
        }));
    }

    get districtItems() {
        const districts = this.selectProvince
            ? this.allDistricts.filter(d => d.province === this.selectProvince)
            : this.allDistricts;

        return districts.map(district => ({
            value: district.name,
            label: district.name
        }));
    }

    // Handle province selection change
    onProvinceChange(selectedProvince: string | null): void {
        this.selectProvince = selectedProvince || '';

        // Clear district selection when province changes
        if (!selectedProvince) {
            this.selectDistrict = '';
        } else {
            // Check if current district is still valid for the selected province
            const isDistrictValid = this.allDistricts.some(d =>
                d.name === this.selectDistrict && d.province === selectedProvince
            );
            if (!isDistrictValid) {
                this.selectDistrict = '';
            }
        }

        this.fetchAllCenterDetails();
    }

    // Handle district selection change
    onDistrictChange(selectedDistrict: string | null): void {
        this.selectDistrict = selectedDistrict || '';

        // When district is selected, automatically set the province
        if (selectedDistrict) {
            const district = this.allDistricts.find(d => d.name === selectedDistrict);
            if (district && district.province !== this.selectProvince) {
                this.selectProvince = district.province;
            }
        }

        this.fetchAllCenterDetails();
    }


    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const provinceDropdownElement = document.querySelector('.custom-province-dropdown-container');
        const proinceDropdownClickedInside = provinceDropdownElement?.contains(event.target as Node);

        if (!proinceDropdownClickedInside && this.isProvinceDropdownOpen) {
            this.isProvinceDropdownOpen = false;
        }

        const districtDropdownElement = document.querySelector('.custom-district-dropdown-container');
        const districtDropdownClickedInside = districtDropdownElement?.contains(event.target as Node);

        if (!districtDropdownClickedInside && this.isDistrictDropdownOpen) {
            this.isDistrictDropdownOpen = false;
        }

    }

    fetchAllCenterDetails(province: string = this.selectProvince, district: string = this.selectDistrict, search: string = this.searchText) {
        this.isLoading = true;
        this.TargetSrv.getCenterDetails(this.currentPage, this.itemsPerPage, province, district, search).subscribe(
            (res) => {
                this.itemsArr = res.items;
                this.totalItems = res.totalItems;
                this.countOfOfficers = res.items.length;
                this.hasData = res.items.length > 0 ? true : false;
                this.isLoading = false;
            }
        );
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.fetchAllCenterDetails();
    }

    onSearch() {
        this.searchText = this.searchText?.trim() || '';
        this.currentPage = 1; // Reset to first page on new search
        this.fetchAllCenterDetails();
    }

    offSearch() {
        this.searchText = '';
        this.fetchAllCenterDetails();
    }

    getTotalPages(): number {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    navigateToDashboard(id: number) {
        this.router.navigate([`/centers/center-dashboard/${id}`]);
    }


    addCenter() {
        this.router.navigate([`/centers/add-a-center`]);
    }

}

class CenterData {
    centerId!: number
    centerName!: string
    province!: string
    district!: string
    city!: string
    contact01!: string
    collectionOfficerCount!: number
    customerOfficerCount!: number
    collectionCenterManagerCount!: number
    customerServiceCount!: number
    regCode!: string
}
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { DropdownModule } from 'primeng/dropdown';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { SerchableDropdownComponent } from '../../../../components/serchable-dropdown/serchable-dropdown.component';

@Component({
    selector: 'app-view-centres',
    standalone: true,
    imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule, LoadingSpinnerComponent, SerchableDropdownComponent],
    templateUrl: './view-centres.component.html',
    styleUrl: './view-centres.component.css'
})
export class ViewCentresComponent implements OnInit {

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

    itemId1: number | null = null;
    itemId2: number | null = null;
    provinceItems = [
        { value: 'Central', label: 'Central' },
        { value: 'Eastern', label: 'Eastern' },
        { value: 'North Central', label: 'North Central' },
        { value: 'North Western', label: 'North Western' },
        { value: 'Northern', label: 'Northern' },
        { value: 'Sabaragamuwa', label: 'Sabaragamuwa' },
        { value: 'Southern', label: 'Southern' },
        { value: 'Uva', label: 'Uva' },
        { value: 'Western', label: 'Western' }
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

    filteredDistricts: { name: string, province: string }[] = [];
    districtItems = this.filteredDistricts.map(d => ({ value: d.name, label: d.name }));

    constructor(
        private router: Router,
        private DistributionSrv: DistributionServiceService,
    ) { }

    ngOnInit(): void {
        this.updateFilteredDistricts();
        this.fetchAllDistributionCenterDetails();
    }

    fetchAllDistributionCenterDetails(province: string = this.selectProvince, district: string = this.selectDistrict, search: string = this.searchText) {
        this.isLoading = true;
        this.DistributionSrv.getDistributionCenterDetails(this.currentPage, this.itemsPerPage, province, district, search).subscribe(
            (res) => {
                this.itemsArr = res.items;
                this.totalItems = res.totalItems;
                this.countOfOfficers = res.items.length;
                this.hasData = res.items.length > 0 ? true : false;
                this.isLoading = false;
            }
        );
    }

    onSearch() {
        this.searchText = this.searchText?.trim() || '';
        this.currentPage = 1; // Reset to first page on new search
        this.fetchAllDistributionCenterDetails();
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.fetchAllDistributionCenterDetails();
    }

    offSearch() {
        this.searchText = this.searchText?.trim() || '';
        this.fetchAllDistributionCenterDetails();
    }

    toggleProvinceDropdown() {
        this.isProvinceDropdownOpen = !this.isProvinceDropdownOpen;
        // Close district dropdown when opening province dropdown
        if (this.isProvinceDropdownOpen) {
            this.isDistrictDropdownOpen = false;
        }
    }

    toggleDistrictDropdown() {
        this.isDistrictDropdownOpen = !this.isDistrictDropdownOpen;
        if (this.isDistrictDropdownOpen) {
            this.isProvinceDropdownOpen = false;
        }
    }


    clearDistrictFilter(event?: MouseEvent) {
        if (event) {
            event.stopPropagation(); // Prevent triggering the dropdown toggle
        }
        this.selectDistrict = '';
        this.fetchAllDistributionCenterDetails();
    }

    filterDistrict(districtName: string | null) {
        if (this.itemId1 !== null) {
            this.selectDistrict = ''
            this.fetchAllDistributionCenterDetails();
        } // keep your original guard

        const selected = this.allDistricts.find(d => d.name === districtName || '');
        this.selectProvince = selected ? selected.province : '';
        this.fetchAllDistributionCenterDetails();
    }

    filterProvince(provinceName: string | null) {
        if (this.itemId2 !== null) {
            this.selectProvince = ''
            this.fetchAllDistributionCenterDetails();
        };

        const selected = this.provinceItems.find(p => p.value === provinceName || '');
        this.updateFilteredDistricts();
        this.fetchAllDistributionCenterDetails();
    }


    updateFilteredDistricts() {
        if (this.selectProvince) {
            this.filteredDistricts = this.allDistricts.filter(d => d.province === this.selectProvince);
            this.districtItems = this.filteredDistricts.map(d => ({ value: d.name, label: d.name }));
        } else {
            this.filteredDistricts = this.allDistricts;
            this.districtItems = this.filteredDistricts.map(d => ({ value: d.name, label: d.name }));
        }
    }

    cancelDistrict() {
        this.clearDistrictFilter();
    }

    getTotalPages(): number {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    navigateToDashboard(id: number, centerName: string, regCode: string) {
        this.router.navigate([
            `/distribution-center/center-dashboard`,
            id,
            centerName,
            regCode
        ]);
    }


    addCenter() {
        this.router.navigate([`/distribution-center/create-distribution-centre`]);
    }

    navigateToAssignCities() {
        this.router.navigate([`/distribution-center/assign-cities`]);
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
    distributionOfficerCount!: number
    distributionCenterManagerCount!: number
    latitude!: string;
    longitude!: string;

}

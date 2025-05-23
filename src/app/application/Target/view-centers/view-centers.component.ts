// view-centers.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { DropdownModule } from 'primeng/dropdown';
import { TargetService } from '../../../services/Target-service/target.service'
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { AddCenterComponent } from '../add-center/add-center.component';

@Component({
    selector: 'app-view-centers',
    standalone: true,
    imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule, LoadingSpinnerComponent, AddCenterComponent],
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

    // Define all Sri Lanka provinces
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

    // Districts filtered by selected province
    filteredDistricts: { name: string, province: string }[] = [];

    constructor(
        private router: Router,
        private TargetSrv: TargetService,
    ) { }

    ngOnInit(): void {
        this.updateFilteredDistricts();
        this.fetchAllCenterDetails();
    }

    fetchAllCenterDetails(province: string = this.selectProvince, district: string = this.selectDistrict, search: string = this.searchText) {
        this.isLoading = true;
        this.TargetSrv.getCenterDetails(this.currentPage, this.itemsPerPage, province, district, search).subscribe(
            (res) => {
                this.itemsArr = res.items;
                this.totalItems = res.totalItems;
                this.countOfOfficers = res.items.length;
                this.isLoading = false;
            }
        );
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.fetchAllCenterDetails();
    }

    onSearch() {
        this.currentPage = 1; // Reset to first page on new search
        this.fetchAllCenterDetails();
    }

    offSearch() {
        this.searchText = '';
        this.fetchAllCenterDetails();
    }

    cancelProvince() {
        this.selectProvince = '';
        this.selectDistrict = ''; // Also clear district when province is cleared
        this.updateFilteredDistricts(); // Update district list
        this.fetchAllCenterDetails();
    }

    filterProvince() {
        this.selectDistrict = ''; // Clear district selection when province changes
        this.updateFilteredDistricts(); // Update district list based on selected province
        this.fetchAllCenterDetails();
    }

    cancelDistrict() {
        this.selectDistrict = '';
        this.fetchAllCenterDetails();
    }

    filterDistrict() {
        // When district is selected, automatically set the province
        if (this.selectDistrict) {
            const district = this.allDistricts.find(d => d.name === this.selectDistrict);
            if (district) {
                this.selectProvince = district.province;
                // Update filtered districts based on the selected province
                this.updateFilteredDistricts();
            }
        }
        this.fetchAllCenterDetails();
    }

    // Update the filtered districts based on selected province
    updateFilteredDistricts() {
        if (this.selectProvince) {
            this.filteredDistricts = this.allDistricts.filter(d => d.province === this.selectProvince);
        } else {
            this.filteredDistricts = this.allDistricts;
        }
    }

    getTotalPages(): number {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    navigateToDashboard(id: number) {
        this.router.navigate([`/centers/center-shashbord/${id}`]);
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
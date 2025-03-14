import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { DropdownModule } from 'primeng/dropdown';
import { TargetService } from '../../../services/Target-service/target.service'
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-view-centers',
    standalone: true,
    imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule, LoadingSpinnerComponent],
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


    constructor(
        private router: Router,
        private TargetSrv: TargetService,
    ) { }

    ngOnInit(): void {
        this.fetchAllCenterDetails();
    }

    fetchAllCenterDetails(province: string = this.selectProvince, district: string = this.selectDistrict, search: string = this.searchText) {
        this.isLoading = true;
        this.TargetSrv.getCenterDetails(province, district, search, this.currentPage, this.itemsPerPage).subscribe(
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
        this.fetchAllCenterDetails(this.selectProvince, this.selectDistrict, this.searchText);
    }

    offSearch() {
        this.searchText = '';
        this.fetchAllCenterDetails(this.selectProvince, this.selectDistrict, this.searchText);
    }

    cancelProvince() {
        this.selectProvince = '';
        this.fetchAllCenterDetails(this.selectProvince, this.selectDistrict);
    }

    filterProvince() {
        this.fetchAllCenterDetails(this.selectProvince, this.selectDistrict);
    }

    cancelDistrict() {
        this.selectDistrict = '';
        this.fetchAllCenterDetails(this.selectProvince, this.selectDistrict);
    }

    filterDistrict() {
        this.fetchAllCenterDetails(this.selectProvince, this.selectDistrict);
    }


    getTotalPages(): number {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    navigateToDashboard(id: number) {
        this.router.navigate([`/centers/center-shashbord/${id}`]);
    }
}

class CenterData {
    id!: number
    centerName!: string
    province!: string
    district!: string
    city!: string
    contact01!: string
    CollectionOfficer!: number
    CustomerOfficer!: number
    CollectionCenterManager!: number
    CustomerService!: number
    regCode!: string
}

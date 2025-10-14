import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportServiceService } from '../../../../services/Report-service/report-service.service';
import { TokenServiceService } from '../../../../services/Token/token-service.service';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { ManageOfficersService } from '../../../../services/manage-officers-service/manage-officers.service';
import { SerchableDropdownComponent } from '../../../../components/serchable-dropdown/serchable-dropdown.component';

@Component({
  selector: 'app-collection-report-component',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent, SerchableDropdownComponent],
  templateUrl: './collection-report-component.component.html',
  styleUrl: './collection-report-component.component.css'
})
export class CollectionReportComponentComponent implements OnInit {
  OfficerArr!: CollectionOfficers[];
  centerArr: Center[] = [];


  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true

  searchText: string = '';
  selectCenters: string = '';


  logingRole: string | null = null;
  isLoading: boolean = true;

  isCenterDropdownOpen = false;
  centerDropdownOptions = [];

  toggleCenterDropdown() {
    this.isCenterDropdownOpen = !this.isCenterDropdownOpen;
  }

  selectCenterOption(center: Center) {
    this.selectCenters = center.id.toString(); // convert id to string
    this.isCenterDropdownOpen = false;
    this.applyCompanyFilters();
  }


  constructor(
    private router: Router,
    private ReportSrv: ReportServiceService,
    private tokenSrv: TokenServiceService,
    private ManageOficerSrv: ManageOfficersService,

  ) {
    this.logingRole = tokenSrv.getUserDetails().role
  }

  ngOnInit(): void {
    if (this.logingRole === 'Collection Centre Head') {
      this.getAllCenters();
    }
    this.fetchAllOfficers();
  }

  get centerDropdownItems() {
    return this.centerArr.map(center => ({
      value: center.id.toString(),
      label: `${center.regCode} - ${center.centerName}`,
      disabled: false
    }));
  }

  // 5. Update your methods
  onCenterSelectionChange(selectedValue: string) {
    this.selectCenters = selectedValue || '';
    this.applyCompanyFilters();
  }

  applyCompanyFilters() {
    this.fetchAllOfficers();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {

    const centerDropdownElement = document.querySelector('.custom-center-dropdown-container');
    const centerDropdownClickedInside = centerDropdownElement?.contains(event.target as Node);

    if (!centerDropdownClickedInside && this.isCenterDropdownOpen) {
      this.isCenterDropdownOpen = false;
    }
  }

  fetchAllOfficers(page: number = 1, limit: number = this.itemsPerPage, searchText: string = '', centerId: string = this.selectCenters) {
    this.isLoading = true;
    let role: string;
    if (this.logingRole === 'Collection Centre Head') {
      role = "CCH"
    } else {
      role = "CCM"
    }

    this.ReportSrv.getAllCollectionReport(role, page, limit, searchText, centerId).subscribe(
      (res) => {
        this.OfficerArr = res.items
        this.totalItems = res.total
        if (res.items.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;
        }
        this.isLoading = false;

      }
    )
  }

  onSearch() {
    this.searchText = this.searchText.trimStart();
    this.fetchAllOfficers(this.page, this.itemsPerPage, this.searchText);
  }

  offSearch() {
    this.searchText = '';
    this.fetchAllOfficers(this.page, this.itemsPerPage, this.searchText);
  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchAllOfficers(this.page, this.itemsPerPage);
  }

  viewmonthlyReport(id: number) {
    this.router.navigate([`reports/collection-monthly-report/${id}`])
  }

  viewFarmerList(id: number, fname: string, lname: string) {
    const name = fname + ' ' + lname;
    this.router.navigate([`reports/farmer-list/${id}/${name}`])
  }

  viewDailyReport(id: number, fname: string, lname: string, empid: string) {
    let name = `${fname} ${lname}`
    this.router.navigate([`reports/daily-report/${id}/${name}/${empid}`])
  }

  getAllCenters() {
    this.ManageOficerSrv.getCCHOwnCenters().subscribe(
      (res) => {
        this.centerArr = res

      }
    )
  }

  // applyCompanyFilters() {
  //   this.fetchAllOfficers();
  // }

  clearCompanyFilter(event: MouseEvent) {
    event.stopPropagation();
    this.selectCenters = '';
    this.fetchAllOfficers();
  }


  get selectedCenterDisplay(): string {
    if (!this.selectCenters) return 'Centres';

    const selectedCenter = this.centerArr.find(center => center.id.toString() === this.selectCenters);
    return selectedCenter ? `${selectedCenter.regCode} - ${selectedCenter.centerName}` : 'Centres';
  }

  checkLeadingSpace() {
    if (this.searchText && this.searchText.startsWith(' ')) {
      this.searchText = this.searchText.trim();
    }
  }

}

class CollectionOfficers {
  id!: number;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
  empId!: string;
  centerName!: string;
}

class Center {
  id!: number
  centerName!: string;
  regCode!: string;
}

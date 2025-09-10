import { Component, HostListener, OnInit } from '@angular/core';
import { TargetService } from "../../../services/Target-service/target.service"
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { NgxPaginationModule } from "ngx-pagination";
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-center-view-price-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './center-view-price-list.component.html',
  styleUrl: './center-view-price-list.component.css'
})
export class
  CenterViewPriceListComponent implements OnInit {
  centerId!: number;
  priceListArr!: PriceList[];
  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  selectGrade: string = '';
  searchText: string = '';

  isLoading:boolean = true;

  isGradeDropdownOpen = false;
  gradeDropdownOptions = ['A', 'B', 'C'];

  togglegradeDropdown() {
    this.isGradeDropdownOpen = !this.isGradeDropdownOpen;
  }

  selectGradeOption(option: string) {
    this.selectGrade = option;
    this.isGradeDropdownOpen = false;
    this.filterGrade();
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private TargetSrv: TargetService,
  ) { }

  ngOnInit(): void {
    this.centerId = this.route.snapshot.params['id'];
    this.fetchAllPriceList(this.centerId);

  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const gradeDropdownElement = document.querySelector('.custom-grade-dropdown-container');
    const gradeDropdownClickedInside = gradeDropdownElement?.contains(event.target as Node);

    if (!gradeDropdownClickedInside && this.isGradeDropdownOpen) {
      this.isGradeDropdownOpen = false;
    }

  }

  fetchAllPriceList(centerId: number, page: number = 1, limit: number = this.itemsPerPage, grade: string = this.selectGrade, search: string = this.searchText) {
    this.isLoading = true;
    this.TargetSrv.getAllPriceList(centerId, page, limit, grade, search).subscribe((res) => {
      this.priceListArr = res.items;
      
      this.totalItems = res.total | 0;
      if (res.items.length === 0) {
        this.hasData = false;
      }else{
        this.hasData = true;
      }
        this.isLoading = false;

    });
  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchAllPriceList(this.centerId, this.page, this.itemsPerPage, this.selectGrade, this.searchText);
  }

  filterGrade() {
    this.fetchAllPriceList(this.centerId, this.page, this.itemsPerPage, this.selectGrade, this.searchText);
  }

  cancelGrade(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectGrade = '';
    this.fetchAllPriceList(this.centerId, this.page, this.itemsPerPage, this.selectGrade, this.searchText);
  }

  // cancelGrade() {
  //   // event.stopPropagation();
  //   this.selectGrade = '';
  //   this.fetchAllPriceList(this.centerId, this.page, this.itemsPerPage, this.selectGrade, this.searchText);
  // }

  onSearch() {
    this.searchText = this.searchText.trimStart();
    this.fetchAllPriceList(this.centerId, this.page, this.itemsPerPage, this.selectGrade, this.searchText);
  }

  offSearch() {
    this.searchText = '';
    this.fetchAllPriceList(this.centerId, this.page, this.itemsPerPage, this.selectGrade, this.searchText);
  }

  toggleGradeDropdown() {
    const select = document.querySelector('select');
    select?.click();
  }

  navigateToCenters() {
    this.router.navigate(['/centers']); // Change '/reports' to your desired route
  }

}

class PriceList {
  id!: number;
  cropNameEnglish!: string;
  varietyNameEnglish!: string;
  averagePrice!: number;
  grade!: string;
  updatedPrice!: number;
  centerName!: string;
  createdAt!: string;

  formattedDate!: string;
  updatedDate!: string;
}

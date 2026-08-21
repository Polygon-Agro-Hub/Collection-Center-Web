import { Component, HostListener, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { TargetService } from "../../../services/Target-service/target.service"
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { NgxPaginationModule } from "ngx-pagination";
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import lottie, { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-center-view-price-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './center-view-price-list.component.html',
  styleUrl: './center-view-price-list.component.css'
})
export class
  CenterViewPriceListComponent implements OnInit, OnDestroy {
  centerId!: number;
  priceListArr!: PriceList[];
  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;
  centerName: string = ''

  today = new Date();

  selectGrade: string = '';
  searchText: string = '';

  isMarketPricerExists: boolean = true;

  isLoading: boolean = true;

  isGradeDropdownOpen = false;
  gradeDropdownOptions = ['A', 'B', 'C'];

  private animationItem: AnimationItem | undefined;

  @ViewChild('lottieContainer') set lottieContainerRef(ref: ElementRef | undefined) {
    this.animationItem?.destroy();
    if (ref) {
      this.animationItem = lottie.loadAnimation({
        container: ref.nativeElement,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/assets/json/No%20Data.json',
      });
    }
  }

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
    this.centerId = +this.route.snapshot.params['id'];
  
    this.isLoading = true;
  
    this.TargetSrv.getAllPriceList(
      this.centerId,
      1,
      this.itemsPerPage,
      this.selectGrade,
      this.searchText
    ).subscribe({
      next: (res) => {
        this.priceListArr = res.items || [];
        this.centerName = res.centerData[0].centerName;
        this.totalItems = res.total || 0;
  
        this.hasData = this.priceListArr.length > 0;
        this.isMarketPricerExists = this.priceListArr.length > 0;
        this.isLoading = false;
      },
      error: (err) => {
        this.priceListArr = [];
        this.totalItems = 0;
        this.hasData = false;
        this.isMarketPricerExists = false;
        this.isLoading = false;
      }
    });
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
    this.page = 1;
    this.fetchAllPriceList(this.centerId, this.page, this.itemsPerPage, this.selectGrade, this.searchText);
  }

  cancelGrade(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectGrade = '';
    this.fetchAllPriceList(this.centerId, this.page, this.itemsPerPage, this.selectGrade, this.searchText);
  }

  onSearch() {
    this.page = 1;
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

  ngOnDestroy(): void {
    this.animationItem?.destroy();
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

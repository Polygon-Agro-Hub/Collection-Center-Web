import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { TargetService } from '../../../services/Target-service/target.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { CustomDatepickerComponent } from '../../../components/custom-datepicker/custom-datepicker.component';
import lottie, { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-view-daily-target',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent, CustomDatepickerComponent],
  templateUrl: './view-daily-target.component.html',
  styleUrls: ['./view-daily-target.component.css'],
})
export class ViewDailyTargetComponent implements OnInit, OnDestroy {


  targetArr!: DailyTargets[];
  allTargets!: DailyTargets[];
  assignTargetArr!: AssignDailyTarget[];
  searchText: string = '';
  selectStatus: string = '';
  selectValidity: string = '';
  today!: string;

  hasData: boolean = false;
  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;

  assignHasData: boolean = true;
  assignPage: number = 1;
  assignTotalItems: number = 0;
  assignItemsPerPage: number = 10;
  assignSearch: string = '';
  selectAssignStatus: string = ''
  assignDate: string = '';


  isSelectPrograss = true;
  isSelectAssign = false;

  isLoading: boolean = false;

  private animationItem: AnimationItem | undefined;

  @ViewChild('lottieContainer') set lottieContainerRef(ref: ElementRef | undefined) {
    this.animationItem?.destroy();
    if (ref) {
      this.animationItem = lottie.loadAnimation({
        container: ref.nativeElement,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/assets/json/NoRowAvailable.json',
      });
    }
  }

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Pending', 'Completed', 'Exceeded', 'Extra'];

  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  selectStatusOption(option: string) {
    this.selectStatus = option;
    this.isStatusDropdownOpen = false;
    this.filterStatus();
  }

  isAssignStatusDropdownOpen = false;
  assignStatusDropdownOptions = ['Updated', 'Assigned', 'Not Assigned'];

  toggleAssignStatusDropdown() {
    this.isAssignStatusDropdownOpen = !this.isAssignStatusDropdownOpen;
  }

  selectAssignStatusOption(option: string) {
    this.selectAssignStatus = option;
    this.isAssignStatusDropdownOpen = false;
    this.filterAssignStatus();
  }

  constructor(
    private router: Router,

    private TargetSrv: TargetService
  ) { }

  ngOnInit(): void {

    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    this.today = `${year}/${month}/${day}`;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.assignDate = this.toDateInputFormat(tomorrow);

    if (history.state.selectAssign) {
      this.selectAssign();
    }

    this.fetchAllTarget();
    this.AssignAllDailyTarget()

  }

  toDateInputFormat(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  get isAssignDateBeforeToday(): boolean {
    if (!this.assignDate) {
      return false;
    }
    const [year, month, day] = this.assignDate.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate < today;
  }

  private getAssignBannerDate(): Date | null {
    if (!this.assignDate) {
      return null;
    }
    const [year, month, day] = this.assignDate.split('-').map(Number);
    const bannerDate = new Date(year, month - 1, day);
    bannerDate.setDate(bannerDate.getDate() - 1);
    return bannerDate;
  }

  get assignBannerDateLabel(): string {
    const bannerDate = this.getAssignBannerDate();
    if (!bannerDate) {
      return '';
    }
    return this.toOrdinalDateLabel(bannerDate);
  }

  get isBeforeAssignDeadline(): boolean {
    const bannerDate = this.getAssignBannerDate();
    if (!bannerDate) {
      return true;
    }
    const deadline = new Date(bannerDate.getFullYear(), bannerDate.getMonth(), bannerDate.getDate(), 19, 0, 0, 0);
    return new Date() < deadline;
  }

  toOrdinalDateLabel(date: Date): string {
    const day = date.getDate();
    const suffix = (day % 10 === 1 && day !== 11) ? 'st'
      : (day % 10 === 2 && day !== 12) ? 'nd'
        : (day % 10 === 3 && day !== 13) ? 'rd'
          : 'th';
    const month = date.toLocaleString('en-US', { month: 'long' });
    return `${day}${suffix} ${month}`;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const statusDropdownElement = document.querySelector('.custom-status-dropdown-container');
    const statusDropdownClickedInside = statusDropdownElement?.contains(event.target as Node);

    const assignStatusDropdownElement = document.querySelector('.custom-assign-status-dropdown-container');
    const assignStatusDropdownClickedInside = assignStatusDropdownElement?.contains(event.target as Node);

    if (!statusDropdownClickedInside && this.isStatusDropdownOpen) {
      this.isStatusDropdownOpen = false;
    }

    if (!assignStatusDropdownClickedInside && this.isAssignStatusDropdownOpen) {
      this.isAssignStatusDropdownOpen = false;
    }

  }

  fetchAllTarget(page: number = 1, limit: number = this.itemsPerPage, search: string = this.searchText) {
    this.isLoading = true;
    this.TargetSrv.getAllDailyTarget(page, limit, search).subscribe(


      (res) => {
        this.allTargets = res.items;
        this.targetArr = [...this.allTargets];
        this.totalItems = res.totalPages
        if (res.items.length > 0) {
          this.hasData = true;
        } else {
          this.hasData = false;
        }
        this.isLoading = false;
      }


    );

  }

  onSearch() {
    this.fetchAllTarget();
  }

  offSearch() {
    this.searchText = '';
    this.fetchAllTarget()
  }

  filterStatus() {

    if (!this.selectStatus) {
      // this.fetchAllTarget();  // Reset and fetch all targets if no filter is selected
      this.targetArr = [...this.allTargets];
      return;
    }

    this.targetArr = this.allTargets.filter(item => item.status === this.selectStatus);

    if (this.targetArr.length > 0) {
      this.hasData = true;
    } else {
      this.hasData = false;
    }
  }

  cancelStatus(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectStatus = '';
    this.fetchAllTarget();
  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchAllTarget(this.page, this.itemsPerPage);

  }
  navigate(path: string) {
    this.router.navigate([path]);
  }

  selectPrograss() {
    this.isSelectPrograss = true;
    this.isSelectAssign = false;
    this.rememberSelectedTab();
  }

  selectAssign() {
    this.isSelectPrograss = false;
    this.isSelectAssign = true;
    this.rememberSelectedTab();
    this.filterAssignStatus();
  }

  // Keeps the active tab in this history entry so browser/back navigation restores it.
  private rememberSelectedTab() {
    history.replaceState({ ...history.state, selectAssign: this.isSelectAssign }, '');
  }

  AssignAllDailyTarget(page: number = 1, limit: number = this.itemsPerPage, search: string = this.assignSearch, date: string = this.assignDate) {
    this.isLoading = true;
    this.TargetSrv.AssignAllDailyTarget(page, limit, search, date).subscribe(
      (res) => {
        this.assignTargetArr = res;
        if (res.length > 0) {
          this.assignHasData = true;
        } else {
          this.assignHasData = false;
        }
        this.isLoading = false;

      }
    );
  }

  navigateToAssignTarget(varietyId: number, companyCenterId: number) {
    this.router.navigate([`/target/assing-target/${varietyId}/${companyCenterId}`]);
  }

  navigateToEditAssignTarget(varietyId: number, companyCenterId: number) {
    this.router.navigate([`/target/edit-assing-target/${varietyId}/${companyCenterId}`]);
  }

  formatTime(time: string): string {
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = minutesStr; // use as is, assuming it's already 2-digit
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // convert '0' to 12 for midnight and adjust hours >12
    return `${hours}:${minutes} ${period}`;
  }

  formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0]
  }

  onAssignDateChange(newDate: string | Date | null) {
    let dateString = '';

    if (newDate instanceof Date) {
      dateString = this.toDateInputFormat(newDate);
    } else if (typeof newDate === 'string') {
      dateString = newDate;
    }

    if (!dateString) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateString = this.toDateInputFormat(tomorrow);
    }

    this.assignDate = dateString;
    this.assignPage = 1;
    this.filterAssignStatus();
  }

  assignOnSearch() {
    this.filterAssignStatus();
  }
  assignOffSearch() {
    this.assignSearch = '';
    this.filterAssignStatus();
  }

  filterAssignStatus() {
    this.isLoading = true;
    this.TargetSrv.AssignAllDailyTarget(1, 10, this.assignSearch, this.assignDate).subscribe(
      (res) => {
        this.assignTargetArr = res || []; // fallback if response is null or undefined
        // Apply filtering
        if (this.selectAssignStatus === 'Updated') {
          this.assignTargetArr = this.assignTargetArr.filter(item =>
            item.isAssign === 1 &&
            (item.assignStatusA === 0 || item.assignStatusB === 0 || item.assignStatusC === 0)
          );
        } else if (this.selectAssignStatus === 'Assigned') {
          this.assignTargetArr = this.assignTargetArr.filter(item =>
            item.isAssign === 1 &&
            item.assignStatusA === 1 &&
            item.assignStatusB === 1 &&
            item.assignStatusC === 1
          );
        } else if (this.selectAssignStatus === 'Not Assigned') {
          this.assignTargetArr = this.assignTargetArr.filter(item =>
            item.isAssign === 0 &&
            item.assignStatusA === 0 &&
            item.assignStatusB === 0 &&
            item.assignStatusC === 0
          );
        }

        this.isLoading = false;

        this.assignHasData = this.assignTargetArr.length > 0;

        this.assignTotalItems = this.assignTargetArr.length;
        this.assignPage = 1;
      },
      (err) => {
        this.isLoading = false;
        console.error('Failed to load data', err);
        this.assignTargetArr = [];
        this.assignHasData = false;
      }
    );
  }

  cancelAssignStatus(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectAssignStatus = '';
    this.filterAssignStatus();
  }

  checkLeadingSpace() {
    if (this.searchText && this.searchText.startsWith(' ')) {
      this.searchText = this.searchText.trim();
    }
  }

  checkLeadingSpaceAssignSearch() {
    if (this.assignSearch && this.assignSearch.startsWith(' ')) {
      this.assignSearch = this.assignSearch.trim();
    }
  }

  ngOnDestroy(): void {
    this.animationItem?.destroy();
  }

}

class AssignDailyTarget {
  cropNameEnglish!: string
  varietyNameEnglish!: string
  qtyA!: number
  qtyB!: number
  qtyC!: number
  assignStatusA!: number
  assignStatusB!: number
  assignStatusC!: number
  toDate!: string
  varietyId!: number;
  companyCenterId!: number;
  isAssign!: number;
}

class DailyTargets {
  id!: number;
  cropNameEnglish!: string;
  varietyNameEnglish!: string;
  grade!: string;
  target!: number;
  complete: number = 0;
  assignStatus: number = 0;
  status!: string;
  date: string = '';
}

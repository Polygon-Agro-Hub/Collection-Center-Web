import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TargetService } from '../../../services/Target-service/target.service';
import { DropdownModule } from 'primeng/dropdown';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-view-officer-target',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, LoadingSpinnerComponent],
  templateUrl: './view-officer-target.component.html',
  styleUrl: './view-officer-target.component.css',
  providers: [DatePipe]
})
export class ViewOfficerTargetComponent implements OnInit {
  officerId!: number;

  selectedOfficerDataArr!: SelectedOfficerTarget[];

  hasData: boolean = true;
  selectStatus: string = '';
  searchText: string = '';

  logingRole: string | null = null;
  isLoading: boolean = true;

  centerName!: string;

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Pending', 'Completed', 'Exceeded'];

  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  selectStatusOption(option: string) {
    this.selectStatus = option;
    this.isStatusDropdownOpen = false;
    this.filterStatus();
  }

  constructor(
    private TargetSrv: TargetService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private tokenSrv: TokenServiceService

  ) {
    this.logingRole = tokenSrv.getUserDetails().role

  }

  ngOnInit(): void {
    this.officerId = this.route.snapshot.params['officerId'];
    this.centerName = this.route.snapshot.params['centerName'];
    this.fetchSelectedOfficerTarget(this.officerId);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const statusDropdownElement = document.querySelector('.custom-status-dropdown-container');
    const statusDropdownClickedInside = statusDropdownElement?.contains(event.target as Node);

    if (!statusDropdownClickedInside && this.isStatusDropdownOpen) {
      this.isStatusDropdownOpen = false;
    }

  }

  fetchSelectedOfficerTarget(officerId: number, status: string = this.selectStatus, search: string = this.searchText) {
    this.isLoading = true;
    this.TargetSrv.getSelectedOfficerTargetData(officerId, status, search).subscribe(
      (res) => {
        this.selectedOfficerDataArr = res.items;
        if (res.items.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;
        }
        this.isLoading = false;
      }
    )
  }


  navigateToNewPage(id: number): void {
    this.router.navigate([`/manage-officers/edit-officer-target/${id}`]);  // Assuming you want to pass the `item.id` to the new page
  }

  cancelStatus(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectStatus = '';
    this.fetchSelectedOfficerTarget(this.officerId, this.selectStatus, this.searchText);
  }

  filterStatus() {
    this.fetchSelectedOfficerTarget(this.officerId, this.selectStatus, this.searchText);
  }

  onSearch() {
    this.fetchSelectedOfficerTarget(this.officerId, this.selectStatus, this.searchText);
  }

  offSearch() {
    this.searchText = '';
    this.fetchSelectedOfficerTarget(this.officerId, this.selectStatus, this.searchText);
  }

  navigateToManageOfficers() {
    this.router.navigate(['/manage-officers']); // Change '/reports' to your desired route
  }

}

class SelectedOfficerTarget {
  id!: number;
  dailyTargetId!: number
  varietyNameEnglish!: string
  cropNameEnglish!: string
  target!: number
  grade!: string
  complete!: string
  toDate!: Date
  toTime!: string
  empId!: string
  status!: string
  remaining!: number
}



import { ActivatedRoute, Router } from "@angular/router";
import { PriceListService } from "../../../services/Price-List-Service/price-list.service";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { NgxPaginationModule } from "ngx-pagination";
import { Component, HostListener, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { LoadingSpinnerComponent } from "../../../components/loading-spinner/loading-spinner.component";
import { TargetService } from '../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-cch-center-price-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './cch-center-price-list.component.html',
  styleUrl: './cch-center-price-list.component.css',
  providers: [DatePipe]
})
export class CchCenterPriceListComponent implements OnInit {

  priceListArr!: PriceList[];
  priceRequestObj: RequestPrice = new RequestPrice();

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  selectGrade: string = '';
  searchText: string = '';
  today!: string;
  editingIndex: number | null = null;
  editValue!: number;
  requestId!: number;
  userId!: number;

  originalValue!: number;

  isLoading: boolean = true;
  isExit: boolean = false;
  isChangeStatusViewOpen: boolean = false;

  isGradeDropdownOpen = false;
  gradeDropdownOptions = ['A', 'B', 'C'];

  toggleGradeDropdown() {
    this.isGradeDropdownOpen = !this.isGradeDropdownOpen;
  }

  selectGradeOption(option: string) {
    this.selectGrade = option;
    this.isGradeDropdownOpen = false;
    this.filterGrade();
  }


  constructor(
    private router: Router,
    private PriceListSrv: PriceListService,
    private datePipe: DatePipe,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    
    this.requestId = Number(this.route.snapshot.paramMap.get('requestId'));
    this.userId = Number(this.route.snapshot.paramMap.get('officerId'));
    this.fetchAllPriceList();

    this.today = this.datePipe.transform(new Date(), 'yyyy/MM/dd') || '';
    this.fetchPriceRequest();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const gradeDropdownElement = document.querySelector('.custom-grade-dropdown-container');
    const roleDropdownClickedInside = gradeDropdownElement?.contains(event.target as Node);

    if (!roleDropdownClickedInside && this.isGradeDropdownOpen) {
      this.isGradeDropdownOpen = false;
    }

  }

  fetchAllPriceList(userId: number = this.userId, page: number = 1, limit: number = this.itemsPerPage, grade: string = this.selectGrade, search: string = this.searchText) {
    this.isLoading = true;
    this.PriceListSrv.getAllPriceListCCH(userId, page, limit, grade, search).subscribe((res) => {
      this.isLoading = false;
      this.priceListArr = res.items;
      this.totalItems = res.total;

      // const newItems = [];

      console.log(res);
      if (res.items.length === 0) {
        this.hasData = false;
      } else {
        this.hasData = true;
      }
      this.isLoading = false;
    });
  }

  fetchPriceRequest(requestId: number = this.requestId) {
    this.isLoading = true;
    this.PriceListSrv.getPriceRequestCCH(requestId).subscribe(
      (res) => {
        this.priceRequestObj = res.items[0];
        console.log(res)
        console.log('object', this.priceRequestObj)
        this.isLoading = false;
      }
    )
  }

  navigate(path: string) {
    this.router.navigate([`${path}`]);
  }

  onPageChange(event: number) {
    this.editingIndex = null;
    this.page = event;
    this.fetchAllPriceList(this.page, this.itemsPerPage);
  }

  filterGrade() {
    this.fetchAllPriceList(this.userId, this.page, this.itemsPerPage, this.selectGrade, this.searchText);
  }

  cancelGrade(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectGrade = '';
    this.isGradeDropdownOpen = false;
    this.fetchAllPriceList(this.userId, this.page, this.itemsPerPage, this.selectGrade, this.searchText);
  }

  onSearch() {
    this.fetchAllPriceList(this.userId, this.page, this.itemsPerPage, this.selectGrade, this.searchText);
  }

  offSearch() {
    this.searchText = '';
    this.fetchAllPriceList(this.userId, this.page, this.itemsPerPage, this.selectGrade, this.searchText);
  }

  isInvalidInput(): boolean {
    // Return true if input is invalid (to disable the button)
    return this.editValue === null ||
      this.editValue === undefined ||
      isNaN(this.editValue) ||
      this.editValue <= 0;
  }

  validateInput() {
    // Ensure value is not negative
    if (this.editValue < 0) {
      this.editValue = 0;
    }

    // Round to 2 decimal places
    if (this.editValue !== null && this.editValue !== undefined) {
      this.editValue = parseFloat(this.editValue.toFixed(2));
    }
  }

  editRow(index: number, currentValue: number) {
    this.editingIndex = index; // Set the row index being edited
    this.editValue = currentValue;
    // Initialize editValue with the current price
    this.originalValue = currentValue; // Store the original value for comparison
  }

  // Add this method to check if there are pending changes
  hasUnsavedChanges(): boolean {
    return this.editingIndex !== null;
  }

  // Modified saveRow method to reset the editing state
  saveRow(id: number, crop: string, variety: string, grade: string) {
    if (this.editValue != null) {
      this.isLoading = true; // Show loading while saving
      this.PriceListSrv.updatePrice(id, this.editValue).subscribe(
        (res) => {
          if (res.status) {
            this.isLoading = false;
            this.toastSrv.success(
              `Successfully changed price of <b style="color:black;">${crop}-${variety}-${grade}</b><br>
               from <b style="color:black;">Rs.${this.originalValue}</b> to 
               <b style="color:black;">Rs.${this.editValue}</b>`,
              { enableHtml: true }
            );
          } else {
            this.isLoading = false;
            this.toastSrv.error('Failed to assign the target!');
          }
          this.editingIndex = null; // Reset editing state after successful save
          console.log('fetching')
          this.fetchAllPriceList(this.page, this.itemsPerPage);
        },
        (error) => {
          console.error('Error updating price:', error);
          Swal.fire('Error', 'Failed to update price', 'error');
          this.isLoading = false;
        }
      );
    } else {
      this.editingIndex = null;
    }
  }

  cancelEdit() {
    this.editingIndex = null;
  }

  leaveWithoutSaving() {
    this.isExit = false;
    this.editingIndex = null;
    this.router.navigate(['/dashbord'])
  }

  stayOnPage() {
    this.isExit = false;
  }

  openPopUp() {
    this.isChangeStatusViewOpen = true;
  }

  RejectStatus() {
    this.isLoading = true;
    console.log('price', this.priceRequestObj)
    this.PriceListSrv.rejectStatus(this.priceRequestObj.id).subscribe(
      
      (res) => {
        if (res.status) {
          this.toastSrv.success(
            'The request Rejected successfully.'
          );
          
          this.isChangeStatusViewOpen = false;
          this.fetchAllPriceList(this.userId, this.page, this.itemsPerPage, this.selectGrade, this.searchText);
        } else {
          this.isLoading = false;
          this.toastSrv.success(
            'Something went wrong while Rejecting the request. Please try again.'
          );
          
          this.isChangeStatusViewOpen = false;
        }
      }
    )
  }

  ApproveStatus() {
    this.isLoading = true;
    console.log('price', this.priceRequestObj)
    this.PriceListSrv.changeStatus(this.priceRequestObj.id, this.priceRequestObj.requestPrice, this.priceRequestObj.centerId).subscribe(
      
      (res) => {
        if (res.status) {
          this.toastSrv.success(
            'The request Approved successfully.'
          );
          
          this.isChangeStatusViewOpen = false;
          this.fetchAllPriceList(this.userId, this.page, this.itemsPerPage, this.selectGrade, this.searchText);
        } else {
          this.isLoading = false;
          this.toastSrv.success(
            'Something went wrong while Approving the request. Please try again.'
          );
          
          this.isChangeStatusViewOpen = false;
        }
      }
    )
  }
}

class PriceList {
  id!: number;
  cropNameEnglish!: string;
  varietyNameEnglish!: string;
  averagePrice!: string;
  grade!: string;
  updatedPrice!: number;
  indicatePrice!: number;
  createdAt!: string;
}

class RequestPrice {
  id!: number
  requestPrice!: string
  status!: string
  empId!: string
  grade!: string
  varietyNameEnglish!: string
  cropNameEnglish!: string
  createdAt!: string
  assignRole!: string
  centerName!: string
  regCode!: string;
  centerId!: number;
}


import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { DropdownModule } from 'primeng/dropdown';
import { PriceListService } from '../../../services/Price-List-Service/price-list.service';
import Swal from 'sweetalert2';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';

@Component({
  selector: 'app-price-request',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule, LoadingSpinnerComponent, SerchableDropdownComponent],
  templateUrl: './price-request.component.html',
  styleUrl: './price-request.component.css',
  providers: [DatePipe]

})
export class PriceRequestComponent implements OnInit {
  reqPriceArr!: RequestPrice[];
  cropGroupArr: CropGroup[] = [];
  cropVarietyArr: CropVariety[] = [];

  gradeOptions: string[] = ["A", "B", "C"];

  priceRequestObject: Request = new Request();

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  searchText: string = '';
  selectGrade: string = '';
  selectStatus: string = '';
  today!: string;
  isPopupVisible: boolean = false
  isLoading: boolean = false;

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Pending', 'Approved', 'Rejected'];

  logingRole: string | null = null;

  isForwardViewOpen: boolean = false;
  isAddRequestOpen: boolean = false;
  forwardId!: number;

  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  selectStatusOption(option: string) {
    this.selectStatus = option;
    this.isStatusDropdownOpen = false;
    this.filterStatus();
  }


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
    private tokenSrv: TokenServiceService,
  ) {this.logingRole = tokenSrv.getUserDetails().role}

  ngOnInit(): void {
    this.today = this.datePipe.transform(new Date(), 'yyyy/MM/dd') || '';
    this.fetchAllRequestPrice()
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const statusDropdownElement = document.querySelector('.custom-status-dropdown-container');
    const statusDropdownClickedInside = statusDropdownElement?.contains(event.target as Node);

    const gradeDropdownElement = document.querySelector('.custom-grade-dropdown-container');
    const roleDropdownClickedInside = gradeDropdownElement?.contains(event.target as Node);

    if (!statusDropdownClickedInside && this.isStatusDropdownOpen) {
      this.isStatusDropdownOpen = false;
    }

    if (!roleDropdownClickedInside && this.isGradeDropdownOpen) {
      this.isGradeDropdownOpen = false;
    }

  }

  fetchAllRequestPrice(page: number = 1, limit: number = this.itemsPerPage, grade: string = this.selectGrade, status: string = '', search: string = this.searchText) {
    this.isLoading = true;
    this.PriceListSrv.getAllRequestPrice(page, limit, grade, status, search).subscribe(
      (res) => {
        this.reqPriceArr = res.items;
        this.totalItems = res.total;
        console.log(res)
        console.log(res.items)


        if (res.items.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;

        }
        this.isLoading = false;
      }
    )
  }

  fetchCropGroup() {
    this.isLoading = true;
    this.PriceListSrv.getCropGroup().subscribe(
      (res) => {
        this.cropGroupArr = res.items;
        console.log(res)
        console.log(this.cropGroupArr)
        this.isLoading = false;
      }
    )
  }

  fetchCropVariety(cropGroupId: number) {
    this.isLoading = true;
    this.PriceListSrv.getCropVariety(cropGroupId).subscribe(
      (res) => {
        this.cropVarietyArr = res.items;
        console.log(res)
        console.log(this.cropVarietyArr)
        this.isLoading = false;
      }
    )
  }

  fetchCurrentPrice(cropGroupId: number, cropVarietyId: number, grade: string) {
    console.log('called', cropVarietyId, cropGroupId, grade)
    this.isLoading = true;
    this.PriceListSrv.getCurrentPrice(cropGroupId, cropVarietyId, grade ).subscribe(
      (res) => {
        console.log('res', res)
        this.priceRequestObject.currentPrice = res.items[0].price;
        this.priceRequestObject.id = res.items[0].id;
        
        console.log(this.priceRequestObject.currentPrice)
        this.isLoading = false;
      }
    )
  }

  get cropGroupDropdownItems() {
    return this.cropGroupArr.map(crop => ({
      value: crop.id.toString(),
      label: crop.cropNameEnglish,
      disabled: false
    }));
  }

  onCropGroupSelectionChange(selectedValue: number) {
    this.priceRequestObject.cropGroupId = selectedValue || null;
    console.log('crop selected:', this.priceRequestObject.cropGroupId);
    this.fetchCropVariety(this.priceRequestObject.cropGroupId!);
  }

  get cropVarietyDropdownItems() {
    return this.cropVarietyArr.map(variety => ({
      value: variety.id.toString(),
      label: variety.varietyNameEnglish,
      disabled: false
    }));
  }

  onCropVarietySelectionChange(selectedValue: number) {
    this.priceRequestObject.cropVarietyId = selectedValue || null;
    console.log('crop selected:', this.priceRequestObject.cropVarietyId);
  }

  get gradeDropDownItems() {
    return this.gradeOptions.map(grade => ({
      value: grade,
      label: grade,
      disabled: false
    }));
  }

  onGradeSelectionChange(selectedValue: string) {
    this.priceRequestObject.grade = selectedValue || 'null';
    console.log('crop selected:', this.priceRequestObject.cropVarietyId);
    this.fetchCurrentPrice(this.priceRequestObject.cropGroupId!, this.priceRequestObject.cropVarietyId!, this.priceRequestObject.grade!);
  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchAllRequestPrice(this.page, this.itemsPerPage);
  }

  openPopup(item: any) {
    this.isPopupVisible = true;

    // Determine which buttons to show based on status
    const isPending = item.status === 'Pending';
    const isApproved = item.status === 'Approved';
    const isRejected = item.status === 'Rejected';

    // Set the message based on status
    let message = '';
    if (isPending) {
      message = 'Are you sure you want to approve or reject this request?';
    } else if (isApproved) {
      message = 'Are you sure you want to reject this request?';
    } else if (isRejected) {
      message = 'Are you sure you want to approve this request?';
    }

    // HTML structure for the popup
    const tableHtml = `
        <div class="container mx-auto bg-white dark:bg-[#363636] text-gray-800 dark:text-white p-4 rounded-lg">
            <h1 class="text-center text-2xl font-bold mb-4 dark:text-white">Crop Name : ${item.cropNameEnglish}</h1>
            <h2 class="text-center text-2xl font-bold mb-4 dark:text-white">Crop Variety : ${item.varietyNameEnglish}</h2>
            <h2 class="text-center text-2xl font-bold mb-4 dark:text-white">Request Price : Rs.${item.requestPrice}/=</h2>
            <h2 class="text-center text-xl font-bold mb-4 dark:text-white">Current Status : ${item.status}</h2>
            <div>
                <p class="text-center">${message}</p>
            </div>
            <div class="flex justify-center mt-4">
                ${isPending || isApproved ? `<button id="rejectButton" class="bg-red-500 text-white px-6 py-2 rounded-lg mr-2">Reject</button>` : ''}
                ${isPending || isRejected ? `<button id="approveButton" class="bg-green-500 text-white px-4 py-2 rounded-lg">Approve</button>` : ''}
            </div>
        </div>
    `;

    Swal.fire({
      html: tableHtml,
      showConfirmButton: false,
      width: 'auto',
      customClass: {
        popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
      },
      didOpen: () => {
        // Handle the "Approve" button click
        const approveButton = document.getElementById('approveButton');
        if (approveButton) {
          approveButton.addEventListener('click', () => {
            this.isPopupVisible = false;
            this.PriceListSrv.ChangeRequestStatus(item.id, 'Approved').subscribe(
              (res) => {
                this.isLoading = true;
                if (res.status) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'The request was approved successfully.',
                    showConfirmButton: false,
                    timer: 3000,
                  });
                  this.fetchAllRequestPrice(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus, this.searchText);
                } else {
                  this.isLoading = false;
                  Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Something went wrong. Please try again.',
                    showConfirmButton: false,
                    timer: 3000,
                  });
                }
              },
              (err) => {
                this.isLoading = false;
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  text: 'An error occurred while approving. Please try again.',
                  showConfirmButton: false,
                  timer: 3000,
                });
              }
            );
          });
        }

        // Handle the "Reject" button click
        const rejectButton = document.getElementById('rejectButton');
        if (rejectButton) {
          rejectButton.addEventListener('click', () => {
            this.isLoading = true;
            this.PriceListSrv.ChangeRequestStatus(item.id, 'Rejected').subscribe(
              (res) => {
                if (res.status) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'The request was rejected successfully.',
                    showConfirmButton: false,
                    timer: 3000,
                  });
                  this.fetchAllRequestPrice(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus, this.searchText);
                } else {
                  this.isLoading = false;
                  Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Something went wrong. Please try again.',
                    showConfirmButton: false,
                    timer: 3000,
                  });
                }
              },
              (err) => {
                this.isLoading = false;
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  text: 'An error occurred while rejecting. Please try again.',
                  showConfirmButton: false,
                  timer: 3000,
                });
              }
            );
          });
        }
      },
    });
  }

  onSearch() {
    this.fetchAllRequestPrice(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus, this.searchText);
  }

  offSearch() {
    this.searchText = '';
    this.fetchAllRequestPrice(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus, this.searchText);
  }

  // cancelGrade() {
  //   this.selectGrade = '';
  //   this.fetchAllRequestPrice(this.page, this.itemsPerPage, this.selectGrade);
  // }

  filterGrade() {
    this.fetchAllRequestPrice(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus, this.searchText);
  }

  cancelGrade(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectGrade = '';
    this.isGradeDropdownOpen = false;
    this.fetchAllRequestPrice(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus, this.searchText);
  }


  cancelStatus(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectStatus = '';
    this.isStatusDropdownOpen = false;
    this.fetchAllRequestPrice(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus, this.searchText);
  }

  filterStatus() {
    this.fetchAllRequestPrice(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus, this.searchText);
  }

  navigate(path: string) {
    this.router.navigate([`${path}`]);
  }

  trimmedSearchText() {
    if (this.searchText && this.searchText.startsWith(' ')) {
      this.searchText = this.searchText.trim();
    }
  }

  forwardRequest(id: number) {
    this.forwardId = id;
    
    this.isForwardViewOpen = true;
  }

  confirmForward() {
    this.isForwardViewOpen = !this.isForwardViewOpen;

    console.log(this.forwardId);
    this.isLoading = true;
    this.PriceListSrv.forwardRequest(this.forwardId).subscribe(
      
      (res) => {
        if (res.status) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'The request was forwarded successfully.',
            showConfirmButton: false,
            timer: 3000,
            customClass: {
              popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
              title: 'dark:text-white',
            },
          });
          this.fetchAllRequestPrice(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus, this.searchText);
        } else {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Something went wrong while forwaring the request. Please try again.',
            showConfirmButton: false,
            timer: 3000,
            customClass: {
              popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
              title: 'dark:text-white',
            },
          });
        }
      }
    )

    // this.router.navigate(['login']);

  }

  cancelForward() {
    this.isForwardViewOpen = !this.isForwardViewOpen;
  }

  openAddRequest() {
    this.isAddRequestOpen = true;
    this.fetchCropGroup();
  }

  closeAddRequest() {
    this.isAddRequestOpen = false;
  }

  submitRequest() {
    this.isLoading = true;
    console.log('price', this.priceRequestObject)
    this.PriceListSrv.addRequest(this.priceRequestObject).subscribe(
      
      (res) => {
        if (res.status) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'The request added successfully.',
            showConfirmButton: false,
            timer: 3000,
            customClass: {
              popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
              title: 'dark:text-white',
            },
          });
          this.isAddRequestOpen = false;
          this.fetchAllRequestPrice(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus, this.searchText);
        } else {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Something went wrong while adding the request. Please try again.',
            showConfirmButton: false,
            timer: 3000,
            customClass: {
              popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
              title: 'dark:text-white',
            },
          });
        }
      }
    )
       
  }

  preventMinus(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'Subtract') {
      event.preventDefault();
    }
  }

  log() {
    console.log('log', this.priceRequestObject.requstPrice)
  }
  

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
}

class CropGroup {
  id!: number
  cropNameEnglish!: string
}

class CropVariety {
  id!: number
  varietyNameEnglish!: string
}

class Request {
  id!: number;
  cropGroupId: number | null = null;
  cropVarietyId: number | null = null;
  grade: string = ''
  currentPrice: number | null = null;
  requstPrice: number | null = null;
}


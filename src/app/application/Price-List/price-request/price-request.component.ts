import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { DropdownModule } from 'primeng/dropdown';
import { PriceListService } from '../../../services/Price-List-Service/price-list.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-price-request',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule],
  templateUrl: './price-request.component.html',
  styleUrl: './price-request.component.css',
  providers: [DatePipe]

})
export class PriceRequestComponent implements OnInit {
  reqPriceArr!: RequestPrice[];

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true;

  searchText: string = '';
  selectGrade: string = '';
  selectStatus: string = '';
  today!: string;
  isPopupVisible: boolean = false


  constructor(
    private router: Router,
    private PriceListSrv: PriceListService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.today = this.datePipe.transform(new Date(), 'yyyy/MM/dd') || '';
    this.fetchAllRequestPrice()
  }

  fetchAllRequestPrice(page: number = 1, limit: number = this.itemsPerPage, grade: string = this.selectGrade, status: string = '', search: string = this.searchText) {
    this.PriceListSrv.getAllRequestPrice(page, limit, grade, status, search).subscribe(
      (res) => {
        this.reqPriceArr = res.items;
        this.totalItems = res.total;
        console.log(res.items.length);
        if (res.items.length === 0) {
          this.hasData = false;
        }else{
          this.hasData = true;

        }
      }
    )
  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchAllRequestPrice(this.page, this.itemsPerPage);
  }

  openPopup(item: any) {
    this.isPopupVisible = true;

    // HTML structure for the popup
    const tableHtml = `
        <div class="container mx-auto">
          <h1 class="text-center text-2xl font-bold mb-4">Crop Name : ${item.cropNameEnglish}</h1>
          <h2 class="text-center text-2xl font-bold mb-4">Crop Veriety : ${item.varietyNameEnglish}</h2>
          <h2 class="text-center text-2xl font-bold mb-4">Request Price : Rs.${item.requestPrice}/=</h2>
          <div >
            <p class="text-center">Are you sure you want to approve or reject this request?</p>
          </div>
          <div class="flex justify-center mt-4">
            <button id="rejectButton" class="bg-red-500 text-white px-6 py-2 rounded-lg mr-2">Reject</button>
            <button id="approveButton" class="bg-green-500 text-white px-4 py-2 rounded-lg">Approve</button>
          </div>
        </div>
      `;

    Swal.fire({
      html: tableHtml,
      showConfirmButton: false, // Hide default confirm button
      width: 'auto',
      didOpen: () => {
        document
          .getElementById('approveButton')
          ?.addEventListener('click', () => {
            this.isPopupVisible = false;
            this.PriceListSrv.ChangeRequestStatus(item.id, 'Approved').subscribe(
              (res) => {
                if (res.status) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'The request was approved successfully.',
                    showConfirmButton: false,
                    timer: 3000,
                  });
                  this.fetchAllRequestPrice(this.page, this.itemsPerPage);
                } else {
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
                // this.isLoading = false;
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

        // Handle the "Reject" button click
        document
          .getElementById('rejectButton')
          ?.addEventListener('click', () => {
            // this.isPopupVisible = false;
            // this.isLoading = true;
            this.PriceListSrv.ChangeRequestStatus(item.id, 'Rejected').subscribe(
              (res) => {
                // this.isLoading = false;
                if (res.status) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'The request was rejected successfully.',
                    showConfirmButton: false,
                    timer: 3000,
                  });
                  this.fetchAllRequestPrice(this.page, this.itemsPerPage);
                } else {
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
                // this.isLoading = false;
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

  cancelGrade() {
    this.selectGrade = '';
    this.fetchAllRequestPrice(this.page, this.itemsPerPage, this.selectGrade);
  }

  filterGrade() {
    this.fetchAllRequestPrice(this.page, this.itemsPerPage, this.selectGrade);
  }

  cancelStatus() {
    this.selectStatus = '';
    this.fetchAllRequestPrice(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus);
  }

  filterStatus() {
    this.fetchAllRequestPrice(this.page, this.itemsPerPage, this.selectGrade, this.selectStatus);
  }

  navigate(path: string) {
    this.router.navigate([`${path}`]);
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
}

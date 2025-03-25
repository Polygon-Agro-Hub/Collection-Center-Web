import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown'
import { NgxPaginationModule } from 'ngx-pagination';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import Swal from 'sweetalert2';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-view-officers',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './view-officers.component.html',
  styleUrl: './view-officers.component.css'
})
export class ViewOfficersComponent implements OnInit {
  OfficerArr!: CollectionOfficers[];
  companyArr!: Company[];
  centerArr: Center[] = [];

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true

  selectStatus: string = '';
  selectRole: string = '';
  searchText: string = '';
  selectCenters: string = '';
  isPopupVisible: boolean = false

  logingRole: string | null = null;
  isLoading: boolean = true;




  constructor(
    private router: Router,
    private ManageOficerSrv: ManageOfficersService,
    private toastSrv: ToastAlertService,
    private tokenSrv: TokenServiceService
  ) {
    this.logingRole = tokenSrv.getUserDetails().role
  }

  ngOnInit(): void {
    // this.fetchAllOfficers();
    this.getAllcompany();
    console.log(this.logingRole);
    this.getAllCenters();
    this.fetchByRole();

  }

  navigate(path: string) {
    this.router.navigate([`${path}`])
  }

  navigateToEdit(id: number) {
    this.router.navigate([`/manage-officers/edit-officer/${id}`])
  }
  navigateToProfile(id: number) {
    this.router.navigate([`/manage-officers/officer-profile/${id}`])

  }

  fetchAllOfficers(page: number = 1, limit: number = this.itemsPerPage, status: string = '', role: string = '', searchText: string = '') {
    this.isLoading = true;
    this.ManageOficerSrv.getAllOfficers(page, limit, status, role, searchText).subscribe(
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


  //add to center filter
  fetchAllOfficersForCCH(page: number = 1, limit: number = this.itemsPerPage, status: string = '', role: string = '', searchText: string = '', selectCompany: string = this.selectCenters) {
    this.isLoading = true;
    this.ManageOficerSrv.getAllOfficersForCCH(page, limit, status, role, searchText, selectCompany).subscribe(
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

  fetchByRole() {
    if (this.logingRole === 'Collection Center Head') {
      this.fetchAllOfficersForCCH();
    } else if (this.logingRole === 'Collection Center Manager') {
      this.fetchAllOfficers();
    } else {
      this.hasData = true;
    }
  }

  getAllcompany() {
    this.ManageOficerSrv.getCompanyNames().subscribe(
      (res) => {

        this.companyArr = res
      }
    )
  }

  deleteCollectionOfficer(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this Collection Officer? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.ManageOficerSrv.deleteOfficer(id).subscribe(
          (data) => {
            if (data.status) {
              console.log('Collection Officer deleted successfully');
              this.toastSrv.success('The Officer has been deleted.')
              this.fetchAllOfficers(this.page, this.itemsPerPage, this.selectStatus, this.selectRole, this.searchText);
              this.isLoading = false;
            } else {
              this.isLoading = false;
              this.toastSrv.error('There was an error deleting the ofiicer')

            }
          },
          (error) => {
            console.error('Error deleting news:', error);
            this.isLoading = false;
            this.toastSrv.error('There was an error deleting the ofiicer')

          }
        );
      }
    });
  }


  openPopup(item: any) {
    this.isPopupVisible = true;
  
    const tableHtml = `
      <div class="container mx-auto">
        <h1 class="text-center text-2xl font-bold mb-4">Officer Name: ${item.firstNameEnglish}</h1>
        <div>
          <p class="text-center">Are you sure you want to approve or reject this collection?</p>
        </div>
        <div class="flex justify-center mt-4">
          <button id="rejectButton" class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg mr-2">
            Reject
          </button>
          <button id="approveButton" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
            Approve
          </button>
        </div>
      </div>
    `;
  
    const swalInstance = Swal.fire({
      html: tableHtml,
      showConfirmButton: false,
      width: 'auto',
      allowOutsideClick: false, // Prevent closing by clicking outside
      didOpen: () => {
        // Approve Button
        document.getElementById('approveButton')?.addEventListener('click', () => {
          this.handleStatusChange(swalInstance, item.id, 'Approved');
        });
  
        // Reject Button
        document.getElementById('rejectButton')?.addEventListener('click', () => {
          this.handleStatusChange(swalInstance, item.id, 'Rejected');
        });
      }
    });
  }
  
  private handleStatusChange(swalInstance: any, id: number, status: 'Approved' | 'Rejected') {
    // Show loading state
    swalInstance.update({
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    this.ManageOficerSrv.ChangeStatus(id, status).subscribe({
      next: (res) => {
        swalInstance.close();
        if (res.status) {
          const action = status === 'Approved' ? 'approved' : 'rejected';
          this.toastSrv.success(`The collection was ${action} successfully.`);
          this.fetchByRole();
        } else {
          this.toastSrv.error(res.message || `Failed to ${status.toLowerCase()} the collection.`);
        }
      },
      error: (err) => {
        swalInstance.close();
        this.toastSrv.error(`An error occurred while ${status.toLowerCase()}ing. Please try again.`);
      }
    });
  }

  applyStatusFilters() {
    this.fetchByRole();
  }

  applyRoleFilters() {
    this.fetchByRole();
  }

  clearStatusFilter() {
    this.selectStatus = ''
    this.fetchByRole();
  }

  clearRoleFilter() {
    this.selectRole = ''
    this.fetchByRole();
  }

  onSearch() {
    this.fetchByRole();
  }

  offSearch() {
    this.searchText = ''
    this.fetchByRole();
  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchByRole();
  }

  applyCompanyFilters() {
    this.fetchByRole();
  }

  clearCompanyFilter() {
    this.selectCenters = '';
    this.fetchByRole();
  }

  getAllCenters() {
    this.ManageOficerSrv.getCCHOwnCenters().subscribe(
      (res) => {
        this.centerArr = res

      }
    )
  }

}


class CollectionOfficers {
  id!: number;
  image!: string;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
  phoneNumber01!: string;
  companyNameEnglish!: string;
  empId!: string;
  jobRole!: string;
  nic!: string;
  status!: string;
  created_at!: string;
  phoneCode01!: string;

  // cch
  centerName!: string;
}

class Company {
  companyNameEnglish!: string
}


class Center {
  id!: number
  centerName!: string
}

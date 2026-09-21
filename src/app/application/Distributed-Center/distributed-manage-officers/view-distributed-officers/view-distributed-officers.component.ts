import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';
import { TokenServiceService } from '../../../../services/Token/token-service.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { DistributedManageOfficersService } from '../../../../services/Distributed-manage-officers-service/distributed-manage-officers.service';
import { SerchableDropdownComponent } from './../../../../components/serchable-dropdown/serchable-dropdown.component';
import { JOB_ROLE_TYPES, JobRoleTypes } from './../../../../../assets/job-roles-data';
@Component({
  selector: 'app-view-distributed-officers',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule, LoadingSpinnerComponent, SerchableDropdownComponent],
  templateUrl: './view-distributed-officers.component.html',
  styleUrl: './view-distributed-officers.component.css'
})
export class ViewDistributedOfficersComponent implements OnInit {
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

  jobRoleTypes: JobRoleTypes = JOB_ROLE_TYPES;

  constructor(
    private router: Router,
    private ManageOficerSrv: DistributedManageOfficersService,
    private toastSrv: ToastAlertService,
    private tokenSrv: TokenServiceService
  ) {
    this.logingRole = tokenSrv.getUserDetails().role
  }


  ngOnInit(): void {
    this.getAllcompany();
    this.getAllCenters();
    this.fetchByRole();
  }

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Approved', 'Not Approved', 'Rejected'];

  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  selectStatusOption(option: string) {
    this.selectStatus = option;
    this.isStatusDropdownOpen = false;
    this.applyStatusFilters();
  }

  isRoleDropdownOpen = false;
  roleDropdownOptions = ['Distribution Centre Manager', 'Distribution Officer', this.jobRoleTypes.lightWeightDriver, this.jobRoleTypes.heavyWeightDriver];

  toggleRoleDropdown() {
    this.isRoleDropdownOpen = !this.isRoleDropdownOpen;
  }

  selectRoleOption(option: string) {
    this.selectRole = option;
    this.isRoleDropdownOpen = false;
    this.applyRoleFilters();
  }

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

  navigate(path: string) {
    this.router.navigate([`${path}`])
  }

  navigateToEdit(id: number) {
    this.router.navigate([`/distribution-officers/edit-distribution-officer/${id}`])
  }
  navigateToProfile(id: number) {
    this.router.navigate([`/distribution-officers/officer-profile/${id}`])

  }

  fetchAllOfficers(page: number = this.page, limit: number = this.itemsPerPage, status: string = this.selectStatus, role: string = this.selectRole, searchText: string = this.searchText) {
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
  fetchAllOfficersForDCH(page: number = this.page, limit: number = this.itemsPerPage, status: string = this.selectStatus, role: string = this.selectRole, searchText: string = this.searchText, selectCompany: string = this.selectCenters) {
    this.isLoading = true;
    this.ManageOficerSrv.getAllOfficersForDCH(page, limit, status, role, searchText, selectCompany).subscribe(
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
    if (this.logingRole === 'Distribution Centre Head') {
      this.fetchAllOfficersForDCH();
    } else if (this.logingRole === 'Distribution Centre Manager') {
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

  deleteCollectionOfficer(id: number, jobRole: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this Distribution Officer? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Default blue
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
        title: 'dark:text-white',
        icon: '!border-gray-200 dark:!border-gray-500',
        confirmButton: 'hover:!bg-[#0c77db] dark:hover:!bg-[#0c77db]',
        cancelButton: '',
        actions: 'gap-2'
      }
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.isLoading = true;
          this.ManageOficerSrv.deleteOfficer(id).subscribe(
            (data) => {
              if (data.status) {
                this.toastSrv.success(`${jobRole} deleted successfully.`)
                this.fetchByRole()
                this.isLoading = false;
              } else {
                this.isLoading = false;
                this.toastSrv.error('There was an error while deleting the officer.')
              }
            },
            (error) => {
              console.error(`Error deleting ${jobRole}:`, error);
              this.isLoading = false;
              this.toastSrv.error(`There was an error while deleting the ${jobRole}.`)
            }
          );
        }
      });
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
    this.page = 1;
    this.applyCompanyFilters();
  }


  openPopup(item: any) {
    this.isPopupVisible = true;

    let message = '';

    if (item.status === 'Approved') {
      message = `Are you sure you want to reject this ${item.jobRole} ?`;
    }
    else if (item.status === 'Rejected') {
      message = `Are you sure you want to approve this ${item.jobRole} ?`;
    }
    else if (item.status === 'Not Approved') {
      message = `Are you sure you want to approve or reject this ${item.jobRole} ?`;
    }
    else {
      message = ``;
    }

    const rejectButton = (item.status === 'Approved' || item.status === 'Not Approved')
      ? `<button id="rejectButton" class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg mr-2 focus:outline-none focus:ring-0">
           Reject
         </button>`
      : '';

    const approveButton = (item.status === 'Rejected' || item.status === 'Not Approved')
      ? `<button id="approveButton" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-0">
           Approve
         </button>`
      : '';

    const tableHtml = `
      <div class="container mx-auto">
        <h1 class="text-center text-2xl font-bold mb-4 dark:text-white">Officer Name: ${item.firstNameEnglish}</h1>
        <div>
          <p class="text-center dark:text-white">${message}</p>
        </div>
        <div class="flex justify-center mt-4">
          ${rejectButton}
          ${approveButton}
        </div>
      </div>
    `;


    const swalInstance = Swal.fire({
      html: tableHtml,
      showConfirmButton: false,
      width: 'auto',
      allowOutsideClick: true,
      background: 'bg-white dark:bg-[#363636]', // Background styles
      color: 'text-gray-800 dark:text-white',   // Text color styles
      customClass: {
        popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
        title: 'dark:text-white'
      },
      didOpen: () => {
        // Approve Button
        document.getElementById('approveButton')?.addEventListener('click', () => {
          Swal.close();
          this.handleStatusChange(swalInstance, item.id, 'Approved', item.jobRole);
        });

        document.getElementById('rejectButton')?.addEventListener('click', () => {
          Swal.close();
          this.handleStatusChange(swalInstance, item.id, 'Rejected', item.jobRole);
        });
      }
    });
  }

  private handleStatusChange(swalInstance: any, id: number, status: 'Approved' | 'Rejected', jobRole: string) {
    // Show loading state
    this.isLoading = true;
    swalInstance.update({
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      customClass: {
        popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
        title: 'dark:text-white',
      },

      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.ManageOficerSrv.ChangeStatus(id, status).subscribe({
      next: (res) => {
        swalInstance.close();
        if (res.status) {
          this.isLoading = false;
          swalInstance.close();
          const action = status === 'Approved' ? 'approved' : 'rejected';
          this.toastSrv.success(`The ${jobRole} was ${action} successfully.`);
          this.fetchByRole();
        } else {
          this.isLoading = false;
          this.toastSrv.error(`Failed to ${status.toLowerCase()} the ${jobRole}.`);
        }
      },
      error: (err) => {
        swalInstance.close();
        this.isLoading = false;
        this.toastSrv.error(`An error occurred while ${status.toLowerCase()}ing. Please try again.`);
      }
    });
  }

  clearStatusFilter(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectStatus = '';
    this.isStatusDropdownOpen = false;
    this.applyStatusFilters();
  }

  // Keep your existing methods
  applyStatusFilters() {
    this.page = 1;
    this.fetchByRole();
  }

  applyRoleFilters() {
    this.page = 1;
    this.fetchByRole();
  }

  clearRoleFilter(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.selectRole = ''
    this.fetchByRole();
  }

  onSearch() {
    this.page = 1;
    this.searchText = this.searchText?.trim() || '';
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
    this.page = 1;
    this.fetchByRole();
  }

  clearCompanyFilter(event: MouseEvent) {
    event.stopPropagation();
    this.selectCenters = '';
    this.applyCompanyFilters();
  }

  getAllCenters() {
    this.ManageOficerSrv.getDCHOwnCenters().subscribe(
      (res) => {
        this.centerArr = res
      }
    )
  }

  get selectedCenterDisplay(): string {
    if (!this.selectCenters) return 'Centre';
    const selectedCenter = this.centerArr.find(center => center.id.toString() === this.selectCenters);
    return selectedCenter ? `${selectedCenter.regCode} - ${selectedCenter.centerName}` : 'Centre';
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
  centerName!: string;
}

class Company {
  companyNameEnglish!: string
}


class Center {
  id!: number
  centerName!: string;
  regCode!: string;
}

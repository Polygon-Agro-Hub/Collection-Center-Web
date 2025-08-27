import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DistributedManageOfficersService } from '../../../services/Distributed-manage-officers-service/distributed-manage-officers.service';
import { DistributionServiceService }  from '../../../services/Distribution-Service/distribution-service.service'

@Component({
  selector: 'app-view-center-officers',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './view-center-officers.component.html',
  styleUrl: './view-center-officers.component.css'
})
export class ViewCenterOfficersComponent implements OnInit {

  OfficerArr!: CollectionOfficers[];
  companyArr!: Company[];
  centerArr: Center[] = [];

  centerId: number | null = null;
  centerName: string | null = null;
  regCode: string | null = null;

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
    private ManageOficerSrv: DistributedManageOfficersService,
    private DistributionSrv: DistributionServiceService,
    private toastSrv: ToastAlertService,
    private tokenSrv: TokenServiceService,
    private route: ActivatedRoute
  ) {
    this.logingRole = tokenSrv.getUserDetails().role
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.centerId = idParam !== null ? +idParam : null;  // convert to number
      this.centerName = params.get('centerName');
      this.regCode = params.get('regCode');
    });
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
  roleDropdownOptions = ['Distribution Center Manager', 'Distribution Officer'];

  toggleRoleDropdown() {
    this.isRoleDropdownOpen = !this.isRoleDropdownOpen;
  }

  selectRoleOption(option: string) {
    this.selectRole = option;
    this.isRoleDropdownOpen = false;
    this.applyRoleFilters();
  }

  // isCenterDropdownOpen = false;
  // centerDropdownOptions = [];

  // toggleCenterDropdown() {
  //   this.isCenterDropdownOpen = !this.isCenterDropdownOpen;
  // }

  // selectCenterOption(center: Center) {
  //   this.selectCenters = center.id.toString(); // convert id to string
  //   this.isCenterDropdownOpen = false;
  //   this.applyCompanyFilters();
  // }





  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const statusDropdownElement = document.querySelector('.custom-status-dropdown-container');
    const statusDropdownClickedInside = statusDropdownElement?.contains(event.target as Node);

    const roleDropdownElement = document.querySelector('.custom-role-dropdown-container');
    const roleDropdownClickedInside = roleDropdownElement?.contains(event.target as Node);

    // const centerDropdownElement = document.querySelector('.custom-center-dropdown-container');
    // const centerDropdownClickedInside = centerDropdownElement?.contains(event.target as Node);

    if (!statusDropdownClickedInside && this.isStatusDropdownOpen) {
      this.isStatusDropdownOpen = false;
    }

    if (!roleDropdownClickedInside && this.isRoleDropdownOpen) {
      this.isRoleDropdownOpen = false;
    }

    // if (!centerDropdownClickedInside && this.isCenterDropdownOpen) {
    //   this.isCenterDropdownOpen = false;
    // }
  }

  navigate(path: string) {
    this.router.navigate([`${path}`])
  }

  navigateToEdit(id: number) {
    this.router.navigate([`/distribution-center/edit-distribution-officer/${id}`])
  }
  navigateToProfile(id: number) {
    this.router.navigate([`/distribution-center/officer-profile/${id}`])

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
  fetchAllCenterOfficersForDCH(page: number = this.page, limit: number = this.itemsPerPage, centerId: number = this.centerId!, status: string = this.selectStatus, role: string = this.selectRole, searchText: string = this.searchText) {
    this.isLoading = true;
    this.DistributionSrv.getAllCenterOfficersForDCH(page, limit, centerId, status, role, searchText).subscribe(
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
    if (this.logingRole === 'Distribution Center Head') {
      this.fetchAllCenterOfficersForDCH();
    } else if (this.logingRole === 'Distribution Center Manager') {
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
        confirmButton: 'hover:!bg-[#3085d6] dark:hover:!bg[#3085d6]',
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
                this.toastSrv.success('The Officer has been deleted.')
                this.fetchByRole()
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
        <h1 class="text-center text-2xl font-bold mb-4 dark:text-white">Officer Name: ${item.firstNameEnglish}</h1>
        <div>
          <p class="text-center dark:text-white">Are you sure you want to approve or reject this Officer?</p>
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
          this.toastSrv.success(`The collection was ${action} successfully.`);
          this.fetchByRole();
        } else {
          this.isLoading = false;
          this.toastSrv.error(res.message || `Failed to ${status.toLowerCase()} the collection.`);
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
    this.fetchByRole();
  }

  // applyStatusFilters() {
  //   this.fetchByRole();
  // }

  // clearStatusFilter() {
  //   this.selectStatus = ''
  //   this.fetchByRole();
  // }

  applyRoleFilters() {
    this.fetchByRole();
  }

  clearRoleFilter(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectRole = ''
    this.fetchByRole();
  }

  onSearch() {
    if (this.searchText) {
      this.searchText = this.searchText.trim();
    }
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

  // applyCompanyFilters() {
  //   this.fetchByRole();
  // }

  // clearCompanyFilter(event: MouseEvent) {
  //   event.stopPropagation();
  //   this.selectCenters = '';
  //   this.applyCompanyFilters();
  // }

  getAllCenters() {
    this.ManageOficerSrv.getDCHOwnCenters().subscribe(
      (res) => {
        this.centerArr = res

      }
    )
  }

  get selectedCenterDisplay(): string {
    if (!this.selectCenters) return 'Centers';

    const selectedCenter = this.centerArr.find(center => center.id.toString() === this.selectCenters);
    return selectedCenter ? `${selectedCenter.regCode} - ${selectedCenter.centerName}` : 'Centers';
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
  centerName!: string;
  regCode!: string;
}

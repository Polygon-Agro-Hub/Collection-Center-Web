import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown'
import { NgxPaginationModule } from 'ngx-pagination';
import { TargetService } from '../../../services/Target-service/target.service';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import Swal from 'sweetalert2';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-center-view-officers',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './center-view-officers.component.html',
  styleUrl: './center-view-officers.component.css'
})
export class CenterViewOfficersComponent implements OnInit {
  centerId!: number;
  OfficerArr!: CollectionOfficers[];
  hasData: boolean = false;

  selectRole: string = '';
  selectStatus: string = '';
  searchText: string = '';
  isPopupVisible: boolean = false

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;

  isLoading: boolean = true;

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Approved', 'Not Approved', 'Rejected'];

  isDownloading = false;

  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  selectStatusOption(option: string) {
    this.selectStatus = option;
    this.isStatusDropdownOpen = false;
    this.applyStatusFilters();
  }

  isRoleDropdownOpen = false;
  roleDropdownOptions = ['Collection Centre Manager', 'Collection Officer', 'Customer Officer'];

  toggleRoleDropdown() {
    this.isRoleDropdownOpen = !this.isRoleDropdownOpen;
  }

  selectRoleOption(option: string) {
    this.selectRole = option;
    this.isRoleDropdownOpen = false;
    this.applyRoleFilters();
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private targetSrv: TargetService,
    private ManageOficerSrv: ManageOfficersService,
    private toastSrv: ToastAlertService
  ) { }

  ngOnInit(): void {
    this.centerId = this.route.snapshot.params['id']
    this.getAllOfficers();
  };

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const statusDropdownElement = document.querySelector('.custom-status-dropdown-container');
    const statusDropdownClickedInside = statusDropdownElement?.contains(event.target as Node);

    if (!statusDropdownClickedInside && this.isStatusDropdownOpen) {
      this.isStatusDropdownOpen = false;
    }

    const roleDropdownElement = document.querySelector('.custom-role-dropdown-container');
    const roleDropdownClickedInside = roleDropdownElement?.contains(event.target as Node);

    if (!roleDropdownClickedInside && this.isRoleDropdownOpen) {
      this.isRoleDropdownOpen = false;
    }

  }

  navigate(path: string) {
    this.router.navigate([`${path}`])
  }

  navigateToEdit(id: number, centerId: number) {
    this.router.navigate([`/centers/edit-officer/${id}/${centerId}`]);
  }

  navigateToProfile(id: number, centerId: number) {
    this.router.navigate([`/centers/officer-profile/${id}/${centerId}`])
  }

  getAllOfficers(centerId: number = this.centerId, page: number = 1, limit: number = this.itemsPerPage, role: string = '', status: string = '', searchText: string = '') {
    this.isLoading = true;
    this.targetSrv.getOfficers(centerId, page, limit, role, status, searchText).subscribe(
      (res) => {

        this.OfficerArr = res.items
        this.totalItems = res.total
        if (res.items.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;
        }
        this.isLoading = false;

      },
      (error) => {
        console.error("Error fetching officers:", error);
        this.OfficerArr = []; // Handle error case
      }
    );
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
      customClass: {
        popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
        title: 'dark:text-white',
        confirmButton: 'hover:!bg-[#3085d6] dark:hover:!bg-[#3085d6]',
        cancelButton: '',
        actions: 'gap-2'
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.ManageOficerSrv.deleteOfficer(id).subscribe(
          (data) => {
            if (data.status) {
              this.toastSrv.success('The Officer has been deleted.')
              this.getAllOfficers(this.centerId, this.page, this.itemsPerPage, this.selectRole, this.selectStatus, this.searchText);
            } else {
              this.toastSrv.error('There was an error deleting the ofiicer')

            }
          },
          (error) => {
            console.error('Error deleting news:', error);
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
      allowOutsideClick: true, // Prevent closing by clicking outside
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
          this.getAllOfficers();
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

  applyRoleFilters() {

    this.getAllOfficers(this.centerId, this.page, this.itemsPerPage, this.selectRole, this.selectStatus, this.searchText)

  }

  // clearRoleFilter() {
  //   this.selectRole = ''
  //   this.getAllOfficers(this.centerId, this.page, this.itemsPerPage, this.selectRole, this.selectStatus, this.searchText)
  // }

  clearRoleFilter(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectRole = ''
    this.getAllOfficers(this.centerId, this.page, this.itemsPerPage, this.selectRole, this.selectStatus, this.searchText)
  }

  applyStatusFilters() {

    this.getAllOfficers(this.centerId, this.page, this.itemsPerPage, this.selectRole, this.selectStatus, this.searchText)
  }

  clearStatusFilter(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectStatus = ''
    this.getAllOfficers(this.centerId, this.page, this.itemsPerPage, this.selectRole, this.selectStatus, this.searchText)
  }

  onSearch() {
    this.searchText = this.searchText.trimStart();
    this.getAllOfficers(this.centerId, this.page, this.itemsPerPage, this.selectRole, this.selectStatus, this.searchText)

  }

  offSearch() {
    this.searchText = ''
    this.getAllOfficers(this.centerId, this.page, this.itemsPerPage, this.selectRole, this.selectStatus, this.searchText)
  }

  onPageChange(event: number) {
    this.page = event;
    this.getAllOfficers(this.page, this.itemsPerPage);
  }

  navigateToCenters() {
    this.router.navigate(['/centers']); // Change '/reports' to your desired route
  }

  

}

class CollectionOfficers {
  id!: number;
  image!: string;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
  phoneCode01!: string;
  phoneNumber01!: string;
  companyNameEnglish!: string;
  empId!: string;
  jobRole!: string;
  nic!: string;
  status!: string;
  created_at!: string;
}

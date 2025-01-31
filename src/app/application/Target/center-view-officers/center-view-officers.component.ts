import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown'
import { NgxPaginationModule } from 'ngx-pagination';
import { TargetService } from '../../../services/Target-service/target.service';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import Swal from 'sweetalert2';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-center-view-officers',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule],
  templateUrl: './center-view-officers.component.html',
  styleUrl: './center-view-officers.component.css'
})
export class CenterViewOfficersComponent implements OnInit{
  centerId: number = 1;
  OfficerArr!: CollectionOfficers[];
  hasData: boolean = true;

  selectRole: string = '';
  selectStatus: string = '';
  searchText: string = '';
  isPopupVisible: boolean = false

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;

  constructor(
    private router: Router,
    private targetSrv: TargetService,
    private ManageOficerSrv: ManageOfficersService,
    private toastSrv: ToastAlertService
  ) { }

  ngOnInit(): void {
    this.getAllOfficers(1);
  };

  navigate(path: string) {
    this.router.navigate([`${path}`])
  }

  navigateToEdit(id:number){
    this.router.navigate([`/centers/edit-officer/${id}`])
  }
  navigateToProfile(id:number){
    this.router.navigate([`/centers/officer-profile/${id}`])

  }

  getAllOfficers(centerId: number, page: number = 1, limit: number = this.itemsPerPage, role: string = '', status: string = '', searchText: string = '') {
    this.targetSrv.getOfficers(centerId, page, limit, role, status, searchText).subscribe(
      (res) => {
        console.log(res);
        
        // console.log(res.items);
        // console.log(res.total);
        this.OfficerArr = res.items
        this.totalItems = res.total
        if (res.items.length === 0) {
          this.hasData = false;
        }else{
          this.hasData = true;
        }

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
    }).then((result) => {
      if (result.isConfirmed) {
        this.ManageOficerSrv.deleteOfficer(id).subscribe(
          (data) => {
            if (data.status) {
              console.log('Officer deleted successfully');
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

  openPopup(officer: any) {
    this.isPopupVisible = true;
  
    // HTML structure for the popup
    const tableHtml = `
      <div class="container mx-auto">
        <h1 class="text-center text-2xl font-bold mb-4">Officer Name : ${officer.firstNameEnglish}</h1>
        <div >
          <p class="text-center">Are you sure you want to approve or reject this collection?</p>
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
        // Handle the "Approve" button click
        document
          .getElementById('approveButton')
          ?.addEventListener('click', () => {
            this.isPopupVisible = false;
            // this.isLoading = true;
            this.ManageOficerSrv.ChangeStatus(officer.id, 'Approved').subscribe(
              (res) => {
                
                // this.isLoading = false;
                if (res.status) {
                  this.toastSrv.success('The collection was approved successfully.')
                  this.getAllOfficers(this.centerId, this.page, this.itemsPerPage, this.selectStatus, this.selectRole, this.searchText);
                  Swal.close();
                } else {
                  this.toastSrv.error(res.message)
                }
              },
              (err) => {
                // this.isLoading = false;
                this.toastSrv.error('An error occurred while approving. Please try again.')
              }
            );
          });
  
        // Handle the "Reject" button click
        document
          .getElementById('rejectButton')
          ?.addEventListener('click', () => {
            // this.isPopupVisible = false;
            // this.isLoading = true;
            this.ManageOficerSrv.ChangeStatus(officer.id, 'Rejected').subscribe(
              (res) => {
                // this.isLoading = false;
                if (res.status) {
                  this.toastSrv.success('The collection was rejected successfully.')

                  this.getAllOfficers(this.centerId, this.page, this.itemsPerPage, this.selectStatus, this.selectRole, this.searchText);
                  Swal.close();
                } else {
                this.toastSrv.error(res.message)

                }
              },
              (err) => {
                // this.isLoading = false;
                this.toastSrv.error('An error occurred while rejecting. Please try again.')

              }
            );
          });
      },
    });
  }

  applyRoleFilters() {
    console.log(this.selectRole);
    this.getAllOfficers(this.centerId, this.page, this.itemsPerPage, this.selectRole, this.selectStatus, this.searchText)

  }

  clearRoleFilter() {
    this.selectRole = ''
    this.getAllOfficers(this.centerId, this.page, this.itemsPerPage, this.selectRole, this.selectStatus, this.searchText)
  }

  applyStatusFilters() {
    console.log(this.selectStatus);
    this.getAllOfficers(this.centerId, this.page, this.itemsPerPage, this.selectRole, this.selectStatus, this.searchText)
  }

  clearStatusFilter() {
    this.selectStatus = ''
    this.getAllOfficers(this.centerId, this.page, this.itemsPerPage, this.selectRole, this.selectStatus, this.searchText)

  }

  onSearch() {
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
}

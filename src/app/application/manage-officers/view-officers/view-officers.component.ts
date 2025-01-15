import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown'
import { NgxPaginationModule } from 'ngx-pagination';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-officers',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, NgxPaginationModule],
  templateUrl: './view-officers.component.html',
  styleUrl: './view-officers.component.css'
})
export class ViewOfficersComponent implements OnInit {
  OfficerArr!: CollectionOfficers[];
  companyArr!: Company[];

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  hasData: boolean = true

  selectStatus: string = '';
  selectRole: string = '';
  searchText: string = '';
  isPopupVisible: boolean = false


  constructor(
    private router: Router,
    private ManageOficerSrv: ManageOfficersService,

  ) { }

  ngOnInit(): void {
    this.fetchAllOfficers();
    this.getAllcompany();
  }

  navigate(path: string) {
    this.router.navigate([`${path}`])
  }

  navigateToEdit(id:number){
    this.router.navigate([`/manage-officers/edit-officer/${id}`])
  }
  navigateToProfile(id:number){
    this.router.navigate([`/manage-officers/officer-profile/${id}`])

  }

  fetchAllOfficers(page: number = 1, limit: number = this.itemsPerPage, status: string = '', role: string = '', searchText: string = '') {
    this.ManageOficerSrv.getAllOfficers(page, limit, status, role, searchText).subscribe(
      (res) => {
        this.OfficerArr = res.items
        this.totalItems = res.total
        if (res.items.length === 0) {
          this.hasData = false;
        }else{
          this.hasData = true;
        }

      }
    )
  }

  getAllcompany() {
    this.ManageOficerSrv.getCompanyNames().subscribe(
      (res) => {
        console.log("company:", res);
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
        this.ManageOficerSrv.deleteOfficer(id).subscribe(
          (data) => {
            if (data.status) {
              console.log('Collection Officer deleted successfully');
              Swal.fire(
                'Deleted!',
                'The Officer has been deleted.',
                'success'
              );
              this.fetchAllOfficers(this.page, this.itemsPerPage, this.selectStatus, this.selectRole, this.searchText);
            } else {
              Swal.fire(
                'Error!',
                'There was an error deleting the news item.',
                'error'
              );
            }
          },
          (error) => {
            console.error('Error deleting news:', error);
            Swal.fire(
              'Error!',
              'There was an error deleting the news item.',
              'error'
            );
          }
        );
      }
    });
  }


  openPopup(item: any) {
    this.isPopupVisible = true;
  
    // HTML structure for the popup
    const tableHtml = `
      <div class="container mx-auto">
        <h1 class="text-center text-2xl font-bold mb-4">Officer Name : ${item.firstNameEnglish}</h1>
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
            this.ManageOficerSrv.ChangeStatus(item.id, 'Approved').subscribe(
              (res) => {
                
                // this.isLoading = false;
                if (res.status) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'The collection was approved successfully.',
                    showConfirmButton: false,
                    timer: 3000,
                  });
                  this.fetchAllOfficers(this.page, this.itemsPerPage, this.selectStatus, this.selectRole, this.searchText);
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: res.message,
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
            this.ManageOficerSrv.ChangeStatus(item.id, 'Rejected').subscribe(
              (res) => {
                // this.isLoading = false;
                if (res.status) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'The collection was rejected successfully.',
                    showConfirmButton: false,
                    timer: 3000,
                  });
                  this.fetchAllOfficers(this.page, this.itemsPerPage, this.selectStatus, this.selectRole, this.searchText);
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: res.message,
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

  applyStatusFilters() {
    console.log(this.selectStatus);
    this.fetchAllOfficers(this.page, this.itemsPerPage, this.selectStatus, this.selectRole)
  }

  applyRoleFilters() {
    console.log(this.selectRole);
    this.fetchAllOfficers(this.page, this.itemsPerPage, this.selectStatus, this.selectRole)

  }

  clearStatusFilter() {
    this.selectStatus = ''
    this.fetchAllOfficers(this.page, this.itemsPerPage, this.selectStatus, this.selectRole)

  }

  clearRoleFilter() {
    this.selectRole = ''
    this.fetchAllOfficers(this.page, this.itemsPerPage, this.selectStatus, this.selectRole)
  }

  onSearch() {
    this.fetchAllOfficers(this.page, this.itemsPerPage, this.selectStatus, this.selectRole, this.searchText)

  }

  offSearch() {
    this.searchText = ''
    this.fetchAllOfficers(this.page, this.itemsPerPage, this.selectStatus, this.selectRole, this.searchText)
  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchAllOfficers(this.page, this.itemsPerPage);
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

class Company {
  companyNameEnglish!: string
}
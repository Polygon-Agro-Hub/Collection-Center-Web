import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReceviedComplaintsComponent } from '../recevied-complaints/recevied-complaints.component';
import { AddComplaintComponent } from '../../add-complaint/add-complaint.component';
import { SendedComplaintComponent } from '../sended-complaint/sended-complaint.component';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, ReceviedComplaintsComponent, AddComplaintComponent, SendedComplaintComponent],
  templateUrl: './view-complaints.component.html',
  styleUrl: './view-complaints.component.css'
})
export class ViewComplaintsComponent implements OnInit {

  isSelectRecevied: boolean = true;
  isSelectSent: boolean = false;
  isAddComplaintOpen: boolean = false;

  category: string = '';
  complaint: string = '';
  isLoading: boolean = false;
  categoryArr: Category[] = [];

  constructor(
    private complaintsService: ComplaintsService,
    private toastSrv: ToastAlertService,
  ) { }

  ngOnInit(): void {
    this.fetchAllCategory();
  }

  selectRecevied() {
    this.isSelectRecevied = true;
    this.isSelectSent = false;
  }

  selectSent() {
    this.isSelectRecevied = false;
    this.isSelectSent = true;
  }

  closeAddComplaint() {
    this.isAddComplaintOpen = false;
  }

  openAddComplaint() {
    this.isAddComplaintOpen = true;
  }

  onSubmit() {
    this.isLoading = true;
    if (this.category === '' || this.complaint.trim() === '') {
      this.toastSrv.warning('Please fill out all fields.')
      // alert('Please fill out all fields.');
      this.isLoading = false;
      return;
    }

    // Create the form data object
    const formData = {
      category: this.category,
      complaint: this.complaint,
    };

    // Send POST request to the backend
    this.complaintsService.submitComplaint(formData).subscribe(
      (response) => {
        if (response.status) {
          this.toastSrv.success('Your complaint has been submitted successfully!');
          // Reset the form fields
          this.isAddComplaintOpen = false;
          this.category = '';
          this.complaint = '';
          this.isLoading = false;
          this.selectSent();

        } else {
          this.isLoading = false;
          this.toastSrv.warning('Please try again')
        }
      },
      (error) => {
        console.error('Error submitting complaint:', error);
        this.isLoading = false;
        this.toastSrv.error('An error occurred while submitting your complaint. Please try again.');
      }
    );
  }

  //not used
  onCancel() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to cancel this form?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, Stay On Page',
      customClass: {
        popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
        title: 'dark:text-white',
        confirmButton: 'hover:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500 dark:focus:ring-red-800',
        cancelButton: 'hover:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-blue-800',
        actions: 'gap-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.isAddComplaintOpen = false;
      }
    });
  }


  fetchAllCategory() {
    this.complaintsService.getComplainCategory().subscribe(
      (res) => {
        this.categoryArr = res;
      }
    )
  }


}


class Category {
  id!: number;
  categoryEnglish!: string
}
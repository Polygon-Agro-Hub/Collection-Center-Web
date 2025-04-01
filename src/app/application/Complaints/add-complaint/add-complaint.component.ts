import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './add-complaint.component.html',
  styleUrls: ['./add-complaint.component.css'], // Corrected the typo
})
export class AddComplaintComponent implements OnInit {
  // Variables for two-way binding
  category: string = '';
  complaint: string = '';
  isLoading: boolean = false;
  categoryArr: Category[] = [];


  refreshScreen() {
    window.location.reload();
  }

  constructor(
    private complaintsService: ComplaintsService,
    private toastSrv: ToastAlertService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchAllCategory();
  }

  // Function to handle form submission
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
          console.log('Complaint submitted successfully:', response);
          this.toastSrv.success('Your complaint has been submitted successfully!');
          this.refreshScreen();
          // Reset the form fields
          this.category = '';
          this.complaint = '';
          this.isLoading = false;

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
        this.toastSrv.warning('Add Complaint Canceled.');
        
        setTimeout(() => {
          this.router.navigate(['/collection/complaints']); // Navigate to the specific route
        }, 500); // Delay to allow the toast to display
      }
    });
  }
  


  fetchAllCategory(){
    this.complaintsService.getComplainCategory().subscribe(
      (res)=>{
        this.categoryArr = res;
        console.log(this.categoryArr);
      }
    )
  }
  

}

class Category {
  id!: number;
  categoryEnglish!:string
}
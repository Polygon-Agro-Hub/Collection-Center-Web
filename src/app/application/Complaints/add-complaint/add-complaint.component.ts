import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-add-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './add-complaint.component.html',
  styleUrls: ['./add-complaint.component.css'], // Corrected the typo
})
export class AddComplaintComponent {
  // Variables for two-way binding
  category: string = '';
  complaint: string = '';
  isLoading: boolean = false;

  refreshScreen() {
    window.location.reload();
  }

  constructor(
    private complaintsService: ComplaintsService,
    private toastSrv: ToastAlertService
  ) { }

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
}

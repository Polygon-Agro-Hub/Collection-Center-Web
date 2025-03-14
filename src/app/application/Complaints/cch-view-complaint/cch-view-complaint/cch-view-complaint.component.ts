import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CchReceviedComplaintComponent } from '../cch-recevied-complaint/cch-recevied-complaint.component';
import { CchSendComplaintComponent } from '../cch-send-complaint/cch-send-complaint.component';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-cch-view-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule, CchReceviedComplaintComponent, CchSendComplaintComponent, LoadingSpinnerComponent],
  templateUrl: './cch-view-complaint.component.html',
  styleUrl: './cch-view-complaint.component.css'
})
export class CchViewComplaintComponent {
  isSelectRecevied: boolean = true;
  isSelectSent: boolean = false;
  isAddComplaintOpen: boolean = false;

  category: string = '';
  complaint: string = '';


  isLoading: boolean = false;

  constructor(
    private complaintsService: ComplaintsService,
    private toastSrv: ToastAlertService
  ) { }

  onSubmit() {
    if (this.category === '' || this.complaint.trim() === '') {
      this.toastSrv.warning('Please fill out all fields.')
      return;
    }

    this.isLoading = true;

    const formData = {
      category: this.category,
      complaint: this.complaint,
    };

    this.complaintsService.submitCCHComplaint(formData).subscribe(
      (response) => {
        if (response.status) {
          console.log('Complaint submitted successfully:', response);
          this.toastSrv.success('Your complaint has been submitted successfully!');
          this.isAddComplaintOpen = false;
          this.category = '';
          this.complaint = '';
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.toastSrv.warning('Please try again')
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error submitting complaint:', error);
        this.toastSrv.error('An error occurred while submitting your complaint. Please try again.');
      }
    );
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

}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DchRecievedComplaintsComponent } from "../dch-recieved-complaints/dch-recieved-complaints.component";
import { DchSentComplaintsComponent } from "../dch-sent-complaints/dch-sent-complaints.component";
import { DistributionComplaintsService } from '../../../services/distribution-complaints-service/distribution-complaints.service';


@Component({
  selector: 'app-dch-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, DchRecievedComplaintsComponent, DchSentComplaintsComponent],
  templateUrl: './dch-complaints.component.html',
  styleUrl: './dch-complaints.component.css'
})
export class DchComplaintsComponent implements OnInit {

  isSelectRecevied: boolean = true;
  isSelectSent: boolean = false;
  isAddComplaintOpen: boolean = false;
  categoryArr: Category[] = [];

  category: string = '';
  complaint: string = '';


  isLoading: boolean = false;

  constructor(
    private complaintsService: ComplaintsService,
    private toastSrv: ToastAlertService,
    private DistributionComplaintsSrv: DistributionComplaintsService
  ) { }

  ngOnInit(): void {
    this.fetchAllCategory();
  }

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

    this.DistributionComplaintsSrv.submitDCHComplaint(formData).subscribe(
      (response) => {
        if (response.status) {
          this.toastSrv.success('Your complaint has been submitted successfully!');
          this.isAddComplaintOpen = false;
          this.category = '';
          this.complaint = '';
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.toastSrv.warning('Please try again')
        }
          this.isLoading = false;

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

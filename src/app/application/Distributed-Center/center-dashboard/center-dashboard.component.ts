import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { CchReceviedComplaintComponent } from '../cch-recevied-complaint/cch-recevied-complaint.component';
// import { CchSendComplaintComponent } from 'cch-send-complaint/cch-send-complaint.component';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { ViewCenterOfficersComponent } from "../view-center-officers/view-center-officers.component";
import { ActivatedRoute } from '@angular/router';
import { ViewDchCenterTargetComponent } from '../view-dch-center-target/view-dch-center-target.component';
import { DchCenterTargetOutForDeliveryComponent } from "../dch-center-target-out-for-delivery/dch-center-target-out-for-delivery.component";

@Component({
  selector: 'app-center-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, ViewCenterOfficersComponent, ViewDchCenterTargetComponent, DchCenterTargetOutForDeliveryComponent],
  templateUrl: './center-dashboard.component.html',
  styleUrl: './center-dashboard.component.css'
})
export class CenterDashboardComponent implements OnInit {

  isSelectProgress: boolean = true;
  isSelectViewOfficers: boolean = false;
  isSelectViewOutForDelivery: boolean =  false;
  isAddComplaintOpen: boolean = false;
  categoryArr: Category[] = [];

  category: string = '';
  complaint: string = '';

  centerId: number | null = null;


  isLoading: boolean = false;

  constructor(
    private complaintsService: ComplaintsService,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.centerId = Number(this.route.snapshot.paramMap.get('id'));
  }

  selectProgress() {
    this.isSelectProgress = true;
    this.isSelectViewOfficers = false;
    this.isSelectViewOutForDelivery = false;
  }

  selectViewOfficers() {
    this.isSelectProgress = false;
    this.isSelectViewOfficers = true;
    this.isSelectViewOutForDelivery = false;
  }

  selectViewOutForDelivery() {
    this.isSelectProgress = false;
    this.isSelectViewOfficers = false;
    this.isSelectViewOutForDelivery = true;
  }

}

class Category {
  id!: number;
  categoryEnglish!: string
}



import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { ViewCenterOfficersComponent } from "../view-center-officers/view-center-officers.component";
import { ActivatedRoute, Router } from '@angular/router';
import { DchPackingLineComponent } from "../dch-packing-line/dch-packing-line.component";
import { TargetProgressOngoingComponent } from '../Distributed-Target/target-progress-ongoing/target-progress-ongoing.component';
import { TargetOutForDeliveryComponent } from "../Distributed-Target/target-out-for-delivery/target-out-for-delivery.component";


@Component({
  selector: 'app-center-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, ViewCenterOfficersComponent, TargetProgressOngoingComponent, DchPackingLineComponent, TargetOutForDeliveryComponent],
  templateUrl: './center-dashboard.component.html',
  styleUrl: './center-dashboard.component.css'
})
export class CenterDashboardComponent implements OnInit {

  isSelectProgress: boolean = false;
  isSelectViewOfficers: boolean = false;
  isSelectViewOutForDelivery: boolean = false;
  isSelectPackingLine: boolean = true;
  isAddComplaintOpen: boolean = false;
  categoryArr: Category[] = [];
  category: string = '';
  complaint: string = '';
  centerId: number | null = null;
  isLoading: boolean = false;

  constructor(
    private complaintsService: ComplaintsService,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.centerId = Number(this.route.snapshot.paramMap.get('id'));
  }

  selectProgress() {
    this.isSelectProgress = true;
    this.isSelectViewOfficers = false;
    this.isSelectViewOutForDelivery = false;
    this.isSelectPackingLine = false;
  }

  selectViewOfficers() {
    this.isSelectProgress = false;
    this.isSelectViewOfficers = true;
    this.isSelectViewOutForDelivery = false;
    this.isSelectPackingLine = false;
  }

  selectViewOutForDelivery() {
    this.isSelectProgress = false;
    this.isSelectViewOfficers = false;
    this.isSelectViewOutForDelivery = true;
    this.isSelectPackingLine = false;
  }


  selectPackingLine() {
    this.isSelectPackingLine = true;
    this.isSelectProgress = false;
    this.isSelectViewOfficers = false;
    this.isSelectViewOutForDelivery = false;
  }

  editCentre() {
    this.router.navigate(['/distribution-center/edit-distribution-centre', this.centerId]);
  }

  viewCentre() {
    this.router.navigate(['/distribution-center/view-distribution-centre', this.centerId]);
  }

}

class Category {
  id!: number;
  categoryEnglish!: string
}



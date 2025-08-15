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

@Component({
  selector: 'app-center-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, ViewCenterOfficersComponent],
  templateUrl: './center-dashboard.component.html',
  styleUrl: './center-dashboard.component.css'
})
export class CenterDashboardComponent implements OnInit {

  isSelectRecevied: boolean = true;
  isSelectViewOfficers: boolean = false;
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

  selectRecevied() {
    this.isSelectRecevied = true;
    this.isSelectViewOfficers = false;
  }

  selectViewOfficers() {
    this.isSelectRecevied = false;
    this.isSelectViewOfficers = true;
  }

}

class Category {
  id!: number;
  categoryEnglish!: string
}



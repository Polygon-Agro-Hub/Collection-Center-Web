import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectVarietyListComponent } from '../select-variety-list/select-variety-list.component';
import { AssignCenterTargetComponent } from '../assign-center-target/assign-center-target.component';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-assign-center-target-view',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectVarietyListComponent, AssignCenterTargetComponent, LoadingSpinnerComponent],
  templateUrl: './assign-center-target-view.component.html',
  styleUrl: './assign-center-target-view.component.css'
})
export class AssignCenterTargetViewComponent implements OnInit {
  centerDetailsObj: CenterDetails = new CenterDetails();

  isAssignTarget: boolean = true;
  isVariety: boolean = false;
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toastSrv: ToastAlertService
  ) { }

  ngOnInit(): void {
    this.centerDetailsObj.centerId = this.route.snapshot.params['id'];
    this.centerDetailsObj.centerName = this.route.snapshot.params['name'];
    this.centerDetailsObj.regCode = this.route.snapshot.params['regCode'];
  }

  selectAssignTarget() {
    this.isAssignTarget = true;
    this.isVariety = false;
  }

  selectVariety() {
    this.isAssignTarget = false;
    this.isVariety = true;
  }

  navigateToCenters() {
    if (this.isAssignTarget) {
      this.toastSrv.warning('Cancel Add New Center Target');
    }
    this.router.navigate(['/centers']);
  }

  navigateToCentreDashboard() {
    if (this.isAssignTarget) {
      this.toastSrv.warning('Cancel Add New Center Target');
    }
    this.location.back();
  }

}

class CenterDetails {
  centerId!: number;
  centerName!: string;
  regCode!: string;
}

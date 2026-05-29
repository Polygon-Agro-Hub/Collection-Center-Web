import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { Location } from '@angular/common';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'

interface OfficerAssignment {
  officerId: number;
  empId: string;
  fullName: string;
  count: number;
  originalCount?: number; // Track original value
}

@Component({
  selector: 'app-assign-distribution-target',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './assign-distribution-target.component.html',
  styleUrl: './assign-distribution-target.component.css'
})
export class AssignDistributionTargetComponent implements OnInit {

  officerArr: Officers[] = [];
  ordersArr: Orders[] = []
  assignedOrdersArr!: OfficerAssignment[];

  totalOrders!: number;
  totalAssignedOrders!: number;
  isCountValid = false;
  hasDataChanged = false; // NEW: Track if any input changed

  currentDate: string = new Date().toISOString().split('T')[0].replace(/-/g, '/');

  noOfOfficers!: number;
  hasData: boolean = true;

  isLoading: boolean = false;

  isExitAssignTarget: boolean = false;

  isLeaveWithOutSaving: boolean = true;

  constructor(
    private router: Router,
    private TargetSrv: TargetService,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute,
    private location: Location,
    private DistributionSrv: DistributionServiceService
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.DistributionSrv.getDistributionCenterOfficers().subscribe((officers) => {
      this.officerArr = officers;
      this.noOfOfficers = officers.length;

      this.DistributionSrv.getDistributionOrders().subscribe((orders) => {
        this.ordersArr = orders;
        if (orders.length === 0) {
          this.hasData = false
        }
        this.isLoading = false;
        this.totalOrders = this.ordersArr.length;
        this.assignedOrdersArr = this.assignOrdersToOfficers();
        this.validateTotalCount();
      });
    });
  }

  assignOrdersToOfficers(): OfficerAssignment[] {
    const assignments: OfficerAssignment[] = this.officerArr.map(officer => ({
      officerId: officer.id,
      empId: officer.empId,
      fullName: `${officer.firstNameEnglish} ${officer.lastNameEnglish}`,
      orders: [],
      count: 0,
      originalCount: 0 // NEW: Store original value
    }));

    const baseCount = Math.floor(this.ordersArr.length / this.officerArr.length);
    let remainder = this.ordersArr.length % this.officerArr.length;

    for (let i = 0; i < assignments.length; i++) {
      const calculatedCount = baseCount + (remainder > 0 ? 1 : 0);
      assignments[i].count = calculatedCount;
      assignments[i].originalCount = calculatedCount; // NEW: Store original
      if (remainder > 0) remainder--;
    }

    return assignments;
  }

  validateTotalCount(): void {
    this.totalAssignedOrders = this.assignedOrdersArr.reduce((sum, item) => sum + Number(item.count || 0), 0);
    this.isCountValid = this.totalAssignedOrders === this.totalOrders;
    // NEW: Check if any value has changed
    this.checkIfDataChanged();
  }

  // NEW: Method to check if any input has been edited
  checkIfDataChanged(): void {
    this.hasDataChanged = this.assignedOrdersArr.some(
      item => item.count !== item.originalCount
    );
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key;
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(charCode)) {
      return;
    }
    if (!/^[0-9]$/.test(charCode)) {
      event.preventDefault();
    }
  }

  onCancel() {
  // Check if there are unsaved changes
  if (this.hasDataChanged) {
    // Show the popup instead of immediate toast
    this.isExitAssignTarget = true;
  } else {
    // No changes, just cancel and navigate
    this.toastSrv.warning('Distribution Centre Targets Assign Cancelled');
    this.router.navigate([`/assign-targets`]);
  }
}

  onSubmit() {
    this.isLeaveWithOutSaving = false;
    this.isLoading = true;
    const assignmentPayload = this.assignedOrdersArr.map((officer) => ({
      officerId: officer.officerId,
      count: officer.count,
    }));

    const orderIdList = this.ordersArr.map((order) => order.processOrderId);
    this.DistributionSrv.assignOrdersToCenterOfficers(assignmentPayload, orderIdList).subscribe(
      (res) => {
        if (res.status) {
          this.isLoading = false;
          this.toastSrv.success('Distribution Centre Targets Assigned Successfully');
          this.router.navigate([`/assign-targets`]);
        }
      },
      (err) => {
        console.error('Error submitting assignments:', err);
        this.isLoading = false;
        this.toastSrv.error('Failed to assign Distribution Centre Targets');
      }
    );
  }

  goBack() {
    // NEW: Optional - warn user if they have unsaved changes
    if (this.hasDataChanged) {
      const confirmBack = confirm('You have unsaved changes. Are you sure you want to go back?');
      if (!confirmBack) {
        return;
      }
    }

    this.location.back();
  }

  leaveWithoutSaving() {
  // Clear the changed flag
  this.hasDataChanged = false;
  
  // Reset the data
  this.fetchData();
  
  // Navigate away
  this.router.navigate([`/assign-targets`]).then(() => {
    this.isExitAssignTarget = false;
    // Show the toast message only when leaving without saving
    this.toastSrv.warning('Distribution Centre Targets Assign Cancelled');
  });
}
  
  stayOnPage() {
    this.isExitAssignTarget = false;
  }
}

class Officers {
  id!: number;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
  empId!: string;
}

class Orders {
  processOrderId!: number;
  orderId!: number;
  status!: string;
  isTargetAssigned!: boolean;
  sheduleDate!: Date;
}
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
}


@Component({
  selector: 'app-assign-distribution-target',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './assign-distribution-target.component.html',
  styleUrl: './assign-distribution-target.component.css'
})
export class AssignDistributionTargetComponent implements OnInit{

  officerArr: Officers[] = [];
  ordersArr: Orders[] = []
  assignedOrdersArr!: OfficerAssignment[];

  totalOrders!: number;  // Set this after fetching orders
  totalAssignedOrders!: number;
  isCountValid = false;

  currentDate: string = new Date().toISOString().split('T')[0].replace(/-/g, '/');

  noOfOfficers!: number;
  hasData: boolean = true;

  isLoading: boolean = false;

  constructor(
    private router: Router,
    private TargetSrv: TargetService,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute,
    private location: Location,
    private DistributionSrv: DistributionServiceService

  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.DistributionSrv.getDistributionCenterOfficers().subscribe((officers) => {
      this.officerArr = officers;
      this.noOfOfficers = officers.length;
  
      this.DistributionSrv.getDistributionOrders().subscribe((orders) => {
        console.log('orders', orders)
        this.ordersArr = orders;
        if (orders.length === 0 ) {
          console.log('fasle')
          this.hasData = false
        }
        this.isLoading = false;
  
        this.totalOrders = this.ordersArr.length;
        this.assignedOrdersArr = this.assignOrdersToOfficers();
        console.log('assignedOrdersArr', this.assignedOrdersArr)
        this.validateTotalCount(); // Check initially
        
      });
    });
  }
  

  
  assignOrdersToOfficers(): OfficerAssignment[] {
    const assignments: OfficerAssignment[] = this.officerArr.map(officer => ({
      officerId: officer.id,
      empId: officer.empId,
      fullName: `${officer.firstNameEnglish} ${officer.lastNameEnglish}`,
      orders: [],  // Not used anymore
      count: 0
    }));
  
    const baseCount = Math.floor(this.ordersArr.length / this.officerArr.length);
    let remainder = this.ordersArr.length % this.officerArr.length;
  
    for (let i = 0; i < assignments.length; i++) {
      assignments[i].count = baseCount + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
    }
  
    return assignments;
  }

  validateTotalCount(): void {
    this.totalAssignedOrders = this.assignedOrdersArr.reduce((sum, item) => sum + Number(item.count || 0), 0);
    console.log('assignedOrdersArr', this.assignedOrdersArr)
    console.log('totalAssignedOrders', this.totalAssignedOrders)
    this.isCountValid = this.totalAssignedOrders === this.totalOrders;
  }

  preventDecimal(event: KeyboardEvent): void {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault();
    }
  }

  onCancel() {

    this.toastSrv.warning('Distribution Center Targets Assign Cancelled')
    this.router.navigate([`/distribution-center-dashboard`]);
  }

  onSubmit() {
    this.isLoading = true;
    console.log('Submitting...', this.totalOrders);
    console.log('assignedOrdersArr', this.assignedOrdersArr);
    console.log('ordersArr', this.ordersArr);
  
    // Extract officerId and count
    const assignmentPayload = this.assignedOrdersArr.map((officer) => ({
      officerId: officer.officerId,
      count: officer.count,
    }));
  
    // Extract all orderIds
    const orderIdList = this.ordersArr.map((order) => order.processOrderId);
  
    console.log('assignmentPayload', assignmentPayload);
    console.log('orderIdList', orderIdList);
  
    // Call service with new data structure
    this.DistributionSrv.assignOrdersToCenterOfficers(assignmentPayload, orderIdList).subscribe(
      (res) => {
        if (res.status) {
          this.isLoading = false;
          this.toastSrv.success('Distribution Center Targets Assigned Successfully');
          this.router.navigate([`/distribution-center-dashboard`]);
        }
      },
      (err) => {
        console.error('Error submitting assignments:', err);
        this.isLoading = false;
        this.toastSrv.error('Failed to assign Distribution Center Targets');
      }
    );
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



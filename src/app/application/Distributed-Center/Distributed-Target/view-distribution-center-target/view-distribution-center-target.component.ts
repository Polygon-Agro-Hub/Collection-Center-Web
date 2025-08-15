import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { Location } from '@angular/common';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'

@Component({
  selector: 'app-view-distribution-center-target',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './view-distribution-center-target.component.html',
  styleUrl: './view-distribution-center-target.component.css'
})
export class ViewDistributionCenterTargetComponent implements OnInit {

  hasData: boolean = true;
  ordersArr: Orders[] = []
  isLoading: boolean = false;


  constructor(
    private router: Router,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute,
    private location: Location,
    private DistributionSrv: DistributionServiceService

  ) { }

  ngOnInit(): void {
    this.fetchDistributionOrders();

  }

  fetchDistributionOrders() {
    this.isLoading = true;
    this.DistributionSrv.getDistributionOrders().subscribe(
      (res) => {
        console.log('res', res);

        if (res.length === 0 ) {
          console.log('fasle')
          this.hasData = false
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
  
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
  
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(today.getDate() + 2);
  
        this.ordersArr = res.map((order: Orders) => {
          const scheduleDate = new Date(order.sheduleDate);
          scheduleDate.setHours(0, 0, 0, 0);
  
          let formattedDateLabel = '';
          if (scheduleDate.getTime() === today.getTime()) {
            formattedDateLabel = 'Today';
          } else if (scheduleDate.getTime() === tomorrow.getTime()) {
            formattedDateLabel = 'Tomorrow';
          } else if (scheduleDate.getTime() === dayAfterTomorrow.getTime()) {
            formattedDateLabel = 'The Day After Tomorrow';
          }
  
          // Remove 'Within' from sheduleTime (case-insensitive, trims leading spaces)
          const cleanedTime = order.sheduleTime.replace(/^Within\s*/i, '');
  
          return {
            ...order,
            sheduleTime: cleanedTime,
            scheduleLabel: formattedDateLabel
          };
        });
  
        console.log('ordersArr', this.ordersArr);
        this.isLoading = false;
      }
    );
  }

  navigateToAssignTarget() {
    this.router.navigate([`/assign-targets/Assign`])
  }
  
  

}

class Orders {
  processOrderId!: number;
  orderId!: number;
  invNo!: string;
  status!: string;
  isTargetAssigned!: boolean;
  sheduleDate!: Date;
  sheduleTime!: string;
  scheduleLabel!: string;
}

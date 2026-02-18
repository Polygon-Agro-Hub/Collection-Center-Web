import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Added Router import
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DistributionServiceService } from '../../../services/Distribution-Service/distribution-service.service';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';

interface OrderMetric {
  label: string;
  count: number;
  color: string;
}

@Component({
  selector: 'app-cash-activity-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './cash-activity-dashboard.component.html',
  styleUrl: './cash-activity-dashboard.component.css'
})
export class CashActivityDashboardComponent implements OnInit {
  isLoading = false;
  centerObj: CenterDetails = {
    centerId: null,
    centerName: '',
    centerRegCode: ''
  };

  storeName = '';
  receivedDate = new Date();

  totalPickupIncome = 0;
  totalDeliveryIncome = 0;

  totPickOrders: number = 0;
  totDeliveryOrders: number = 0;

  pickupMetrics: OrderMetric[] = [];
  deliveryMetrics: OrderMetric[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private distributionSrv: DistributionServiceService
  ) { }

  ngOnInit(): void {
    this.setStoreNameFromQueryParams();
    this.setCenterDetails();
    this.fetchData();
  }

  private setStoreNameFromQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      const centerName = params['name'];
      const centerRegCode = params['regCode'];

      if (centerRegCode && centerName) {
        this.storeName = `${centerRegCode} ${centerName}`;
      } else if (centerName) {
        this.storeName = centerName;
      } else {
        this.storeName = 'Unknown Store';
      }
    });
  }

  private setCenterDetails(): void {
    this.route.params.subscribe(params => {
      this.centerObj.centerId = params['id'] || null;
    });

    this.route.queryParams.subscribe(params => {
      this.centerObj.centerName = params['name'] || '';
      this.centerObj.centerRegCode = params['regCode'] || '';
    });
  }

  formatCurrency(amount: number): string {
    return `Rs. ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  viewPickupRevenue(): void {
    const id = this.centerObj.centerId;
    const name = this.centerObj.centerName;
    const regCode = this.centerObj.centerRegCode;

    this.router.navigate([`/distribution-hub/action/view-polygon-centers/view-pikup-chash-revenue/${id}`], {
      queryParams: { name, regCode }
    });
  }



  viewDeliveryRevenue(): void {
    const id = this.centerObj.centerId;
    const name = this.centerObj.centerName;
    const regCode = this.centerObj.centerRegCode;

    this.router.navigate([`/distribution-hub/action/view-polygon-centers/view-delivery-revenue/${id}`], {
      queryParams: { name, regCode }
    });
  }

  fetchData() {
    this.isLoading = true;
    this.distributionSrv.getRecivedCashDashbord().subscribe(
      (res) => {
        console.log(res);
        // this.pickUpObj = res.pickupResult;
        this.assignPickUpOrders(res.pickupResult)
        this.assignDelivaryOrders(res.delivaryResult)
        this.isLoading = false;
      }
    )
  }

  assignPickUpOrders(data: IPickUp) {
    this.pickupMetrics = [
      { label: 'All Ready to Pickup Orders', count: data.total_today, color: '#EED600' },
      { label: 'Today Ready to Pickup Orders', count: data.scheduled_today, color: '#415CFF' },
      { label: 'Overdue Ready to Pickups', count: (data.total_today - data.scheduled_today), color: '#FF3D3D' },
      { label: 'All Pickups Completed Today', count: data.all_pickup, color: '#7ED100' },
      { label: "Today's Scheduled Pickups", count: data.today_pickup, color: '#00BCFB' },
      { label: 'Overdue Pickups - Today', count: (data.all_pickup - data.today_pickup), color: '#FFA202' }
    ]

    this.totalPickupIncome = data.order_price
    this.totPickOrders = data.all_pickup
  }

  assignDelivaryOrders(data: IDelivary) {
    this.deliveryMetrics = [
      { label: 'All Out For Delivery Orders', count: data.total_today, color: '#EED600' },
      { label: 'Today Out For Delivery Orders', count: data.scheduled_today, color: '#415CFF' },
      { label: 'Overdue Out For Delivery Orders', count: (data.total_today - data.scheduled_today), color: '#FF3D3D' },
      { label: 'All Deliveries Completed Today', count: data.all_delivary, color: '#7ED100' },
      { label: "Today's Scheduled Deliveries", count: data.today_delivary, color: '#00BCFB' },
      { label: 'Overdue Deliveries - Today', count: (data.all_delivary - data.today_delivary), color: '#FFA202' },
      { label: "Returned Orders Today", count: data.returned_today, color: '#A50000' }
    ]
    this.totalDeliveryIncome = data.order_price
    this.totDeliveryOrders = data.all_delivary

  }

}

interface CenterDetails {
  centerId: number | null;
  centerName: string;
  centerRegCode: string;
}

interface CashPrice {
  total_price: number;
  total_orders: number;
}

interface IPickUp {
  total_today: number;
  scheduled_today: number;
  not_scheduled_today: number;
  all_pickup: number;
  today_pickup: number;
  order_price: number;
}

interface IDelivary {
  total_today: number;
  scheduled_today: number;
  all_delivary: number;
  today_delivary: number;
  order_price: number;
  returned_today: number;

}

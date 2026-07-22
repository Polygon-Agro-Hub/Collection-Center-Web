import { CommonModule, DatePipe, Location  } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';
import { CustomDatepickerComponent } from "../../../../components/custom-datepicker/custom-datepicker.component";
import Swal from 'sweetalert2';
import { TokenServiceService } from '../../../../services/Token/token-service.service';

export interface PackingLineRow {
  id: number;
  companyCenterId: number;
  rowIndex: number;
  isEnabled: number;
  positions:number;
}

@Component({
  selector: 'app-dcm-positioning',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent, CustomDatepickerComponent],
  templateUrl: './dcm-positioning.component.html',
  styleUrl: './dcm-positioning.component.css'
})
export class DcmPositioningComponent {

  isLoading: boolean = false;

  regCode!: string;
  centerName!: string;
  centerId!: number;

  rows: PackingLineRow[] = [];
  total!: number;

  constructor(
    private router: Router,
    private DistributionSrv: DistributionServiceService,
    private location: Location,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute,
    private tokenSrv: TokenServiceService
  ) {}

  ngOnInit(): void {
  this.fetchDcmPositionsForRows()
}

  fetchDcmPostitioningRows() {
    this.isLoading = true;
    this.DistributionSrv.getDCMPositioningRows().subscribe(
      (res) => {
        this.rows = res.items;
        this.total = res.items.length || 0;
        console.log('total', this.total)
        // this.hasData = this.ordersArr.length > 0;
        // if (this.selectStatus === '' && this.hasData) {
        //   this.isTarget = true;
        // } 
        this.isLoading = false;
      }
    )
  }

  fetchDcmPositionsForRows() {
    this.isLoading = true;
    this.DistributionSrv.getDcmPositionsForRows(10).subscribe(
      (res) => {
        this.rows = res.items;
        this.total = res.items.length || 0;
        console.log('total', this.total)
        // this.hasData = this.ordersArr.length > 0;
        // if (this.selectStatus === '' && this.hasData) {
        //   this.isTarget = true;
        // } 
        this.isLoading = false;
      }
    )
  }
  

}

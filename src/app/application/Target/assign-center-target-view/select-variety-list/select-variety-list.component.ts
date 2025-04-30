import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-select-variety-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './select-variety-list.component.html',
  styleUrl: './select-variety-list.component.css'
})
export class SelectVarietyListComponent implements OnInit {
  @Input() centerDetails!: CenterDetails;

  cropsArr: CenterCrops[] = [];

  hasData: boolean = true;
  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;


  cropCount: number = 0;
  searchText: string = '';
  constructor(
    private router: Router,
    private TargetSrv: TargetService,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.fetchCenterCrops();
  }

  fetchCenterCrops(page: number = this.page, limit: number = this.itemsPerPage, search: string = this.searchText) {
    this.TargetSrv.getCenterCrops(this.centerDetails.centerId, page, limit, search).subscribe(
      (res) => {
        this.cropsArr = res.items
        this.cropCount = res.items.length;
        this.hasData = this.cropsArr.length > 0 ? true : false;
        this.totalItems = res.total;
      }
    )
  }

  onAdd(isAssing: number, cropId: number) {
    let isSelected = 0;
    if (isAssing === 1) {
      isSelected = 0;
    } else {
      isSelected = 1;
    }

    let data = {
      centerId: this.centerDetails.centerId,
      isAssign: isSelected,
      cropId: cropId
    }

    this.TargetSrv.addORremoveCenterCrops(data).subscribe(
      (res) => {
        if (res.status) {
          this.toastSrv.success(res.message);
          this.fetchCenterCrops();
        } else {
          this.toastSrv.error(res.message);
        }
        this.fetchCenterCrops();
      }
    )
  }

  onPageChange(event: number) {
    this.page = event;
    this.fetchCenterCrops();
  }

  onSearchVarity() {
    this.fetchCenterCrops();
  }

  offSearchVarity() {
    this.searchText = '';
    this.fetchCenterCrops();
  }

}

class CenterDetails {
  centerId!: number;
  centerName!: string;
  regCode!: string;
}

class CenterCrops {
  cropNameEnglish!: string
  varietyNameEnglish!: string;
  cropId!: number;
  isAssign: number = 0;
}


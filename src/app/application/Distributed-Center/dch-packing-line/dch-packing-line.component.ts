import { CommonModule, DatePipe, Location  } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DistributionServiceService } from '../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { CustomDatepickerComponent } from "../../../components/custom-datepicker/custom-datepicker.component";
import Swal from 'sweetalert2';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { of } from 'rxjs';
export interface PackingLineRow {
  id: number;
  companyCenterId: number;
  rowIndex: number;
  isEnabled: number;
  positions: Positions[];
}

export interface Positions {
  id: number;
  rowId: number;
  pIndex: number | null;
  pType: 'QR' | 'QC' | 'NOR';
}

@Component({
  selector: 'app-dch-packing-line',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent, CustomDatepickerComponent],
  templateUrl: './dch-packing-line.component.html',
  styleUrl: './dch-packing-line.component.css'
})
export class DchPackingLineComponent {

  isLoading: boolean = false;

  regCode!: string;
  centerName!: string;
  centerId!: number;

  rows: PackingLineRow[] = [];
  positions: Positions[] = [];
  currentRow!: PackingLineRow;
  newPos!: number;

  total!: number;

  showCreateRowModal: boolean = false;
  showCreatePositionModal: boolean = false;
  showDeletePositionModal: boolean = false;
  positionToDelete!: Positions;

  logingRole: string | null = null;

  constructor(
    private router: Router,
    private DistributionSrv: DistributionServiceService,
    private location: Location,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute,
    private tokenSrv: TokenServiceService
  ) { 
    this.logingRole = tokenSrv.getUserDetails().role
  }


  ngOnInit(): void {
  let center$;

  if (this.logingRole === 'Distribution Centre Head') {
    this.centerId = Number(this.route.snapshot.paramMap.get('id'));
    this.centerName = String(this.route.snapshot.paramMap.get('centerName'));
    this.regCode = String(this.route.snapshot.paramMap.get('regCode'));

    center$ = of(null); // Completes immediately
  } else {
    center$ = this.DistributionSrv.getDCMCenterId();
  }

  center$.subscribe({
    next: (res) => {
      if (res !== null) {
        this.centerId = res;
      }

      this.fetchDCHCenterRows();
    },
    error: (err) => {
      console.error(err);
    }
  });
}

  fetchDcmCenterId() {
    this.isLoading = true;
    console.log('sdsds1')
    this.DistributionSrv.getDCMCenterId().subscribe(
      
      (res) => {
        this.centerId = res;
        console.log('center', this.centerId)
        this.isLoading = false;
      }
    )
  }

  fetchDCHCenterRows() {
    this.isLoading = true;
    this.DistributionSrv.getDCHCenterRows(this.centerId).subscribe(
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

  get nextRowNo(): number {
    return this.rows.length + 1;
  }

  get nextPosNo(): number {
    return this.rows.length + 1;
  }

  formatRowNo(rowNo: number): string {
    return rowNo < 10 ? '0' + rowNo : `${rowNo}`;
  }

  getOrderedPositions(row: PackingLineRow): Positions[] {
    const qr = row.positions.filter(p => p.pType === 'QR');
    const nor = row.positions
      .filter(p => p.pType === 'NOR')
      .sort((a, b) => (a.pIndex ?? 0) - (b.pIndex ?? 0));
    const qc = row.positions.filter(p => p.pType === 'QC');
    return [...qr, ...nor, ...qc];
  }

  getPositionLabel(pos: Positions): string {
    return pos.pType === 'NOR' ? `PO${pos.pIndex}` : pos.pType;
  }

  getPositionClass(pType: Positions['pType']): string {
    switch (pType) {
      case 'QR':
        return 'bg-[#FFFFF3] text-[#C97E06] border-[#E69D00]';
      case 'NOR':
        return 'bg-[#EEF2FF] text-[#415CFF] border-[#415CFF]';
      case 'QC':
        return 'bg-[#FFF3FA] text-[#FF4174] border-[#FF4174]';
    }
  }

  openCreateRowModal(): void {
    this.currentRow = this.rows[this.rows.length] || [];
    console.log('currentRow', this.currentRow)
    this.showCreateRowModal = true;
  }

  cancelCreateRow(): void {
    this.showCreateRowModal = false;
  }

  confirmCreateRow(): void {
    const currentRowIndex = this.rows.length > 0 ? this.rows.length : 0
    console.log('currentRowIndex', currentRowIndex);
    this.createDCHCenterRow(currentRowIndex + 1);
    // this.rows.push({ rowIndex: this.nextRowNo, isEnabled: true, positionsArr: [] });
    this.showCreateRowModal = false;
  }

  createDCHCenterRow(nextRow: number) {
  this.isLoading = true;
    this.DistributionSrv.createDCHCenterRow(this.centerId, nextRow).subscribe(
      (res) => {
if (res.success) {
    Swal.fire({
      icon: 'success',
      title: 'success',
      html: 'success fully added a new row',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'bg-tileLight dark:bg-[#363636] text-black dark:text-white',
        title: 'font-semibold text-lg',
        htmlContainer: 'text-left',
        confirmButton: 'bg-red-500 dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-700',
      },
    });
} else {
  Swal.fire({
      icon: 'error',
      title: 'error',
      html: 'error adding a new row',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'bg-tileLight dark:bg-[#363636] text-black dark:text-white',
        title: 'font-semibold text-lg',
        htmlContainer: 'text-left',
        confirmButton: 'bg-red-500 dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-700',
      },
    });
}
        
        this.isLoading = false;
        this.fetchDCHCenterRows();
      }
    )
  }

  toggleRow(row: PackingLineRow): void {
    const enableStatus = row.isEnabled === 0 ? 1 : 0;
    console.log('isEnabled', row.isEnabled)
    this.DistributionSrv.toggleRow(enableStatus, row.id).subscribe(
      (res) => {
        row.isEnabled = res.isEnabled
        
        this.isLoading = false;
        this.showCreatePositionModal = false;
        console.log('rows', this.rows)
        // this.fetchDCHCenterRows();
      }
    )

  }

  openCreatePositionModal(row: PackingLineRow): void {
    console.log('row', row)
    this.currentRow = row;
    this.newPos = row.positions.length - 1;
    this.showCreatePositionModal = true;
  }

  cancelCreatePosition(): void {
    this.showCreatePositionModal = false;
  }

  // confirmCreatePosition(): void {
  //   this.rows.push({ rowNo: this.nextRowNo, disabled: true });
  //   this.showCreatePositionModal = false;
  // }

  createNextPosNo() {
    this.isLoading = true;
    const nextPos = (this.currentRow.positions.length - 2) + 1;
    console.log('nextPos', nextPos)
    this.DistributionSrv.createDCHCenterPos(this.centerId, nextPos, this.currentRow.positions[0].rowId).subscribe(
      (res) => {
if (res.success) {
    Swal.fire({
      icon: 'success',
      title: 'success',
      html: 'successfully added a new position',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'bg-tileLight dark:bg-[#363636] text-black dark:text-white',
        title: 'font-semibold text-lg',
        htmlContainer: 'text-left',
        confirmButton: 'bg-red-500 dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-700',
      },
    });
} else {
  Swal.fire({
      icon: 'error',
      title: 'error',
      html: 'error adding a new position',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'bg-tileLight dark:bg-[#363636] text-black dark:text-white',
        title: 'font-semibold text-lg',
        htmlContainer: 'text-left',
        confirmButton: 'bg-red-500 dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-700',
      },
    });
}
        
        this.isLoading = false;
        this.showCreatePositionModal = false;
        this.fetchDCHCenterRows();
      }
    )
  }

   cancelCreatePos(): void {
    this.showCreatePositionModal = false;
  }

  openDeletePositionModal(row: PackingLineRow, pos: Positions): void {
    this.currentRow = row;
    this.positionToDelete = pos;
    this.showDeletePositionModal = true;
  }

  cancelDeletePosition(): void {
    this.showDeletePositionModal = false;
  }

  confirmDeletePosition(): void {
    this.isLoading = true;
    this.DistributionSrv.deleteDCHCenterPos(this.positionToDelete.rowId, this.positionToDelete.pIndex!).subscribe(
      (res) => {
        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'success',
            html: 'successfully deleted the position',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'bg-tileLight dark:bg-[#363636] text-black dark:text-white',
              title: 'font-semibold text-lg',
              htmlContainer: 'text-left',
              confirmButton: 'bg-red-500 dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-700',
            },
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'error',
            html: 'error deleting the position',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'bg-tileLight dark:bg-[#363636] text-black dark:text-white',
              title: 'font-semibold text-lg',
              htmlContainer: 'text-left',
              confirmButton: 'bg-red-500 dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-700',
            },
          });
        }

        this.isLoading = false;
        this.showDeletePositionModal = false;
        this.fetchDCHCenterRows();
      }
    )
  }

}



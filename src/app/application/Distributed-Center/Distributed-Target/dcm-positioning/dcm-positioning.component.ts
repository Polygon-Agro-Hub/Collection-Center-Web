import { CommonModule, DatePipe, Location  } from '@angular/common';
import { Component, HostListener, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import lottie from 'lottie-web';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';
import { CustomDatepickerComponent } from "../../../../components/custom-datepicker/custom-datepicker.component";
import Swal from 'sweetalert2';
import { TokenServiceService } from '../../../../services/Token/token-service.service';
import { SerchableDropdownComponent } from '../../../../components/serchable-dropdown/serchable-dropdown.component';


export interface PackingLineRow {
  id: number;
  companyCenterId: number;
  rowIndex: number;
  isEnabled: number;
  norCount:number;
}

export interface Positions {
  id: number;
  rowId: number;
  pIndex: number;
  pType: string;
  items: PositionsCrops[];
}

export interface PositionsCrops {
  positionCropId: number;
  mpiId: number;
  varietyId: number;
  category: string;
  displayName:string;
}

export interface ChangeItems {
  positionCropId: number;
  posId: number;
  rowId: number;
  pIndex: number;
  mpiId: number;
  varietyId: number;
  category: string;
  displayName:string;
}

export interface Products {
  id: number;
  varietyId: number;
  displayName: string;
  category: string;

}

@Component({
  selector: 'app-dcm-positioning',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent, CustomDatepickerComponent, SerchableDropdownComponent],
  templateUrl: './dcm-positioning.component.html',
  styleUrl: './dcm-positioning.component.css'
})
export class DcmPositioningComponent implements OnInit, AfterViewChecked {

  isLoading: boolean = false;

  regCode!: string;
  centerName!: string;
  centerId!: number;

  rows: PackingLineRow[] = [];
  positions: Positions[] = [];
  productsArr: Products[] = [];
  total!: number;
  hasData: boolean = false;
  @ViewChild('dcmNoRowsAnim') dcmNoRowsAnim!: ElementRef;
  private noRowsAnimInstance: any = null;
  private noRowsAnimLoaded: boolean = false;
  hasPositionsData: boolean = false;
  selectedRow!: PackingLineRow;

  view: string = "rows";

  // ===== Pending changes to send on save =====
  addedItems: ChangeItems[] = [];
  deletedItems: ChangeItems[] = [];

  // ===== Add-product modal state =====
  isModalOpen: boolean = false;
  activeSlot: Positions | null = null;
  activeSlotIndex: number | null = null;
  selectedProductId: number | null = null;

  // ===== Remove-confirm modal state =====
  isRemoveConfirmOpen: boolean = false;
  private pendingRemoval: { slot: Positions; item: PositionsCrops; index: number } | null = null;

  // ===== Validation display state: only show messages after a user-triggered change or a save attempt =====
  attemptedSave: boolean = false;

  constructor(
    private router: Router,
    private DistributionSrv: DistributionServiceService,
    private location: Location,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute,
    private tokenSrv: TokenServiceService
  ) {}

  ngOnInit(): void {
  this.fetchDcmPostitioningRows()
}

  fetchDcmPostitioningRows() {
    this.isLoading = true;
    this.DistributionSrv.getDCMPositioningRows().subscribe(
      (res) => {
        this.rows = res.items;
        console.log('rows', this.rows)
        this.total = res.items.length || 0;
        console.log('total', this.total)
        this.hasData = res.items.length > 0;
        this.isLoading = false;
        if (!this.hasData) {
          // let AfterViewChecked load the animation when the view is ready
          this.noRowsAnimLoaded = false;
        } else if (this.noRowsAnimInstance) {
          this.noRowsAnimInstance.destroy();
          this.noRowsAnimInstance = null;
          this.noRowsAnimLoaded = false;
        }
      }
    )
  }

  private loadNoRowsAnimation() {
    try {
      if (this.noRowsAnimInstance) {
        this.noRowsAnimInstance.destroy();
        this.noRowsAnimInstance = null;
      }
      const container = this.dcmNoRowsAnim?.nativeElement;
      if (!container) return;
      this.noRowsAnimInstance = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/json/NoRowAvailable.json'
      });
    } catch (err) {
      console.error('Failed to load Lottie animation', err);
    }
  }

  onPlace(row: PackingLineRow): void {
    if (row.norCount <= 0) {
      return;
    }
    this.selectedRow = row;
    this.attemptedSave = false;
    this.view = 'placement';
    console.log('view', this.view)
    this.fetchDcmPositionsForRows(this.selectedRow.id);
  }

  fetchDcmPositionsForRows(id: number) {
    this.isLoading = true;
    this.DistributionSrv.getDcmPositionsForRows(id).subscribe(
      (res) => {
        this.positions = res.items.items;
        this.productsArr = res.mpItems.mpiItems;
        console.log('productsArr', this.productsArr)
        this.total = this.positions.length || 0;
        console.log('positions', this.positions)
        this.hasPositionsData = this.positions.length > 0;
       
        this.isLoading = false;
      }
    )
  }

  ngAfterViewChecked(): void {
    if (!this.hasData && !this.noRowsAnimLoaded) {
      const container = this.dcmNoRowsAnim?.nativeElement;
      if (container) {
        this.loadNoRowsAnimation();
        this.noRowsAnimLoaded = true;
      }
    }
  }


  formatRowLabel(rowNumber: number): string {
    return 'Row ' + rowNumber.toString().padStart(2, '0');
  }

  formatSelectedRowLabel(rowNumber: number): string {
    return 'Row ' + rowNumber;
  }

  get productDropdownItems() {
    return this.productsArr.map(product => ({
      value: product.id,
      label: `${product.displayName} - ${product.category}`
    }));
  }

  // ===== Add product modal handlers =====
  openAddModal(slot: Positions): void {
    this.activeSlot = slot;
    this.activeSlotIndex = slot.pIndex;
    this.selectedProductId = null;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.activeSlot = null;
    this.activeSlotIndex = null;
    this.selectedProductId = null;
  }

  confirmPlaceProduct(): void {
    if (!this.activeSlot || !this.selectedProductId) {
      return;
    }

    const product = this.productsArr.find(p => p.id === this.selectedProductId);
    if (!product) {
      return;
    }

    const newCrop: PositionsCrops = {
      positionCropId: null as any,
      mpiId: product.id,
      varietyId: product.varietyId,
      category: product.category,
      displayName: product.displayName
    };

    this.activeSlot.items.push(newCrop);
    this.attemptedSave = true;

    this.addedItems.push({
      positionCropId: null as any,
      posId: this.activeSlot.id,
      rowId: this.activeSlot.rowId,
      pIndex: this.activeSlot.pIndex,
      mpiId: product.id,
      varietyId: product.varietyId,
      category: product.category,
      displayName: product.displayName
    });

    this.closeModal();
  }

  // ===== Remove item flow =====
  requestRemoveItem(slot: Positions, item: PositionsCrops, index: number): void {
    this.pendingRemoval = { slot, item, index };
    this.isRemoveConfirmOpen = true;
  }

  get pendingRemovalItemLabel(): string {
    if (!this.pendingRemoval) {
      return '';
    }
    return `${this.pendingRemoval.item.displayName} - ${this.pendingRemoval.item.category}`;
  }

  get pendingRemovalPosition(): number {
    return this.pendingRemoval?.slot.pIndex ?? 0;
  }

  closeRemoveConfirm(): void {
    this.isRemoveConfirmOpen = false;
    this.pendingRemoval = null;
  }

  confirmRemove(): void {
    if (!this.pendingRemoval) {
      return;
    }

    const { slot, item, index } = this.pendingRemoval;
    slot.items.splice(index, 1);
    this.attemptedSave = true;

    if (!item.positionCropId) {
      // Item was added in this session and never saved - discard it silently.
      const pendingIndex = this.addedItems.findIndex(a =>
        a.rowId === slot.rowId && a.pIndex === slot.pIndex && a.mpiId === item.mpiId && a.varietyId === item.varietyId
      );
      if (pendingIndex > -1) {
        this.addedItems.splice(pendingIndex, 1);
      }
    } else {
      this.deletedItems.push({
        positionCropId: item.positionCropId,
        posId: slot.id,
        rowId: slot.rowId,
        pIndex: slot.pIndex,
        mpiId: item.mpiId,
        varietyId: item.varietyId,
        category: item.category,
        displayName: item.displayName
      });
    }

    this.closeRemoveConfirm();
  }

  // ===== Validation: same varietyId cannot appear in more than one position =====
  private getDuplicateVarietyIds(): Set<number> {
    const counts = new Map<number, number>();
    this.positions.forEach(p =>
      p.items.forEach(item => {
        counts.set(item.varietyId, (counts.get(item.varietyId) || 0) + 1);
      })
    );

    const duplicates = new Set<number>();
    counts.forEach((count, varietyId) => {
      if (count > 1) {
        duplicates.add(varietyId);
      }
    });
    return duplicates;
  }

  isItemDuplicate(item: PositionsCrops): boolean {
    return this.getDuplicateVarietyIds().has(item.varietyId);
  }

  isPositionInvalid(slot: Positions): boolean {
    const duplicates = this.getDuplicateVarietyIds();
    return slot.items.some(item => duplicates.has(item.varietyId));
  }

  isPositionEmpty(slot: Positions): boolean {
    return slot.items.length === 0;
  }

  hasValidationErrors(): boolean {
    return this.getDuplicateVarietyIds().size > 0 || this.positions.some(slot => this.isPositionEmpty(slot));
  }

    // ===== Navigation / save =====
  goBack(): void {
    this.view = 'rows';
    this.positions = [];
    this.addedItems = [];
    this.deletedItems = [];
    this.fetchDcmPostitioningRows();
  }

  onCancel(): void {
    this.goBack();
  }

  onSave(): void {
    this.attemptedSave = true;

    if (this.positions.some(slot => this.isPositionEmpty(slot))) {
      this.toastSrv.error('Every position must have at least one product.');
      return;
    }

    if (this.hasValidationErrors()) {
      this.toastSrv.error('Please remove duplicate products.');
      return;
    }

    if (this.addedItems.length === 0 && this.deletedItems.length === 0) {
      this.goBack();
      return;
    }

    this.isLoading = true;
    this.DistributionSrv.saveDcmPositionItems(this.selectedRow.id, this.addedItems, this.deletedItems).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastSrv.success('Positions saved successfully.');
        this.goBack();
      },
      error: () => {
        this.isLoading = false;
        this.toastSrv.error('Failed to save positions. Please try again.');
      }
    });
  }

}

import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DistributionProcurementService } from '../../../services/disribution-procuement-service/distribution-procurement.service';

interface ShortageItem {
  id: number;
  itemName: string;
  imageUrl: string;
  shortageKg: number;
  distributionCenters: DistributionCenterDto[];
  filteredCenters: DistributionCenterDto[];
  selectedDC: DistributionCenterDto | null;
  marketPricePerKg: number;
  ceilingPercent: number;
  assignedBy: string;
  finalized: boolean;
  dropdownOpen: boolean;
}

export interface DistributionCenterDto {
  comCenId: number;
  value: string;
  label: string;
  fullName: string;
}

@Component({
  selector: 'app-shortage-today-finalization',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, LoadingSpinnerComponent],
  templateUrl: './shortage-today-finalization.component.html',
  styleUrl: './shortage-today-finalization.component.css',
})
export class ShortageTodayFinalizationComponent {
  isLoading = false;
  isFinalizing = false;
  errorMessage = '';

  shortageItems: ShortageItem[] = [];

  showConfirmModal = false;
  itemPendingFinalize: ShortageItem | null = null;

  constructor(private distributionService: DistributionProcurementService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.distributionService.getShortageToFinalizeList().subscribe({
      next: (toFinalizeRes) => {
        const toFinalizeItems = this.mapToShortageItems(
          toFinalizeRes?.data || [],
          false,
        );

        this.distributionService.getShortageFinalizedList().subscribe({
          next: (finalizedRes) => {
            const finalizedItems = this.mapToShortageItems(
              finalizedRes?.data || [],
              true,
            );
            this.shortageItems = [...toFinalizeItems, ...finalizedItems];
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error fetching finalized list:', err);
            this.errorMessage = 'Failed to load finalized items.';
            this.isLoading = false;
          },
        });
      },
      error: (err) => {
        console.error('Error fetching to-finalize list:', err);
        this.errorMessage = 'Failed to load shortage data.';
        this.isLoading = false;
      },
    });
  }

  private mapToShortageItems(data: any[], finalized: boolean): ShortageItem[] {
    return data.map((item) => {
      const distributionCenters: DistributionCenterDto[] =
        item.distributionCenters || [];

      const preselectedDC =
        item.selectedDC ||
        distributionCenters.find((dc) => dc.comCenId === item.comCenId) ||
        null;

      return {
        id: item.shortageAssignedId,
        itemName: item.itemName,
        imageUrl: item.imageUrl,
        shortageKg: item.shortageKg,
        distributionCenters,
        filteredCenters: [...distributionCenters],
        selectedDC: preselectedDC,
        marketPricePerKg: Number(item.marketPricePerKg) || 0,
        ceilingPercent: Number(item.ceilingPercent) || 0,
        assignedBy: item.assignedBy,
        finalized,
        dropdownOpen: false,
      };
    });
  }

  get toFinalizeList(): ShortageItem[] {
    return this.shortageItems.filter((item) => !item.finalized);
  }

  get finalizedList(): ShortageItem[] {
    return this.shortageItems.filter((item) => item.finalized);
  }

  formatCurrency(value: number): string {
    return `Rs. ${Number(value ?? 0).toFixed(2)}`;
  }

  toggleCentreDropdown(item: ShortageItem) {
    this.shortageItems.forEach((i) => {
      if (i !== item) i.dropdownOpen = false;
    });
    item.dropdownOpen = !item.dropdownOpen;
    if (item.dropdownOpen) {
      item.filteredCenters = [...item.distributionCenters];
    }
  }

  onCentreSearchInput(event: Event, item: ShortageItem) {
    const value = (event.target as HTMLInputElement).value.toLowerCase().trim();
    item.filteredCenters = item.distributionCenters.filter((dc) => {
      const combined = `${dc.value}-${dc.fullName}`.toLowerCase();
      const combined2 = `${dc.value} - ${dc.fullName}`.toLowerCase();
      return combined.includes(value) || combined2.includes(value);
    });
  }

  selectCentreOption(item: ShortageItem, dc: DistributionCenterDto) {
    item.selectedDC = dc;
    item.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.centre-dropdown-wrapper')) {
      this.shortageItems.forEach((i) => (i.dropdownOpen = false));
    }
  }

  onCeilingInput(event: Event, item: ShortageItem) {
    const inputEl = event.target as HTMLInputElement;
    let sanitized = inputEl.value.replace(/[^0-9.]/g, '');

    const firstDotIndex = sanitized.indexOf('.');
    if (firstDotIndex !== -1) {
      sanitized =
        sanitized.slice(0, firstDotIndex + 1) +
        sanitized.slice(firstDotIndex + 1).replace(/\./g, '');
    }

    inputEl.value = sanitized;
    item.ceilingPercent = sanitized === '' ? 0 : Number(sanitized);
  }

  onFinalizeClick(item: ShortageItem) {
    if (!item.selectedDC) {
      this.errorMessage =
        'Please select a distribution centre before finalizing.';
      return;
    }
    this.errorMessage = '';
    this.itemPendingFinalize = item;
    this.showConfirmModal = true;
  }

  onCancelFinalize() {
    this.itemPendingFinalize = null;
    this.showConfirmModal = false;
  }

  onConfirmFinalize() {
    const item = this.itemPendingFinalize;
    const selectedDC = item?.selectedDC;

    if (!item || !selectedDC) {
      return;
    }

    this.isFinalizing = true;

    this.distributionService
      .finalizeShortageAssigned(
        item.id,
        selectedDC.comCenId,
        item.ceilingPercent,
      )
      .subscribe({
        next: () => {
          this.isFinalizing = false;
          this.itemPendingFinalize = null;
          this.showConfirmModal = false;
          this.loadAllData();
        },
        error: (err) => {
          console.error('Error finalizing shortage assignment:', err);
          this.errorMessage = 'Failed to finalize. Please try again.';
          this.isFinalizing = false;
          this.showConfirmModal = false;
        },
      });
  }

  formatQty(value: number): string {
    return (Number(value) || 0).toFixed(2);
  }

  getCentreNameOnly(dc: DistributionCenterDto | null | undefined): string {
    if (!dc?.fullName) return '';
    return dc.fullName.replace(/^\s*[A-Za-z0-9-]+\s*[-:]\s*/, '').trim();
  }
}

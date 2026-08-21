import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DistributionProcurementService } from '../../../services/disribution-procuement-service/distribution-procurement.service';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';

interface ShortageItem {
  id: number;
  itemName: string;
  imageUrl: string;
  shortageKg: number;
  distributionCenters: DistributionCenterDto[];
  selectedDC: DistributionCenterDto | null;
  marketPricePerKg: number;
  ceilingPercent: number;
  assignedBy: string;
  finalized: boolean;
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
  imports: [CommonModule, FormsModule, DialogModule, LoadingSpinnerComponent, SerchableDropdownComponent],
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
        selectedDC: preselectedDC,
        marketPricePerKg: Number(item.marketPricePerKg) || 0,
        ceilingPercent: Number(item.ceilingPercent) || 0,
        assignedBy: item.assignedBy,
        finalized,
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

  getCentreDropdownItems(item: ShortageItem) {
    return item.distributionCenters.map((dc) => ({
      value: dc,
      label: `${dc.value} - ${this.getCentreNameOnly(dc)}`,
    }));
  }

  onCentreSelected(item: ShortageItem, dc: DistributionCenterDto | null) {
    item.selectedDC = dc;
  }

  onCeilingInput(event: Event, item: ShortageItem) {
  const inputEl = event.target as HTMLInputElement;

  // Strip anything that isn't a digit (blocks special chars, decimals, minus sign)
  let sanitized = inputEl.value.replace(/[^0-9]/g, '');

  // Strip leading zeros (e.g. "01" -> "1", "00" -> "")
  sanitized = sanitized.replace(/^0+(?=\d)/, '');

  // Cap to max 2 digits while typing (prevents "999" -> stops at "99")
  if (sanitized.length > 2) {
    sanitized = sanitized.slice(0, 2);
  }

  if (sanitized === '' || sanitized === '0') {
    inputEl.value = '';
    item.ceilingPercent = 0; // treated as "invalid/empty" until blur
    return;
  }

  let numericValue = parseInt(sanitized, 10);

  // Clamp to 99 in case of edge cases (e.g. "99" typed then another digit pasted)
  if (numericValue > 99) {
    numericValue = 99;
  }

  inputEl.value = String(numericValue);
  item.ceilingPercent = numericValue;
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

  onCeilingKeydown(event: KeyboardEvent) {
  // Block minus, plus, exponent, decimal point outright
  const blockedKeys = ['-', '+', 'e', 'E', '.', ','];
  if (blockedKeys.includes(event.key)) {
    event.preventDefault();
  }
}

onCeilingBlur(item: ShortageItem) {
  if (!item.ceilingPercent || item.ceilingPercent < 1) {
    item.ceilingPercent = 1;
  } else if (item.ceilingPercent > 99) {
    item.ceilingPercent = 99;
  }
}
}

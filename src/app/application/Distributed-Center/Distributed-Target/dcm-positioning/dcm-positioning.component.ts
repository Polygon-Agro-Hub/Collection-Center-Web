import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RowData {
  rowNumber: number;
  positionsAvailable: number;
}

interface PositionSlot {
  code: string;
  items: string[];
}

interface ProductOption {
  id: string;
  name: string;
  variant: string; // e.g. 'Wholesale', 'Retail'
}

@Component({
  selector: 'app-dcm-positioning',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dcm-positioning.component.html',
  styleUrl: './dcm-positioning.component.css'
})
export class DcmPositioningComponent {
  view: 'list' | 'placement' = 'list';
  selectedRow: RowData | null = null;

  rows: RowData[] = [
    { rowNumber: 1, positionsAvailable: 5 },
    { rowNumber: 2, positionsAvailable: 5 },
    { rowNumber: 3, positionsAvailable: 0 }
  ];

  positions: PositionSlot[] = [];

  // ===== Modal state =====
  isModalOpen = false;
  activeSlot: PositionSlot | null = null;
  activeSlotIndex: number | null = null; // position number, e.g. 1 for P01
  selectedProductId: string | null = null;

  productOptions: ProductOption[] = [
    { id: 'beans-wholesale', name: 'Beans', variant: 'Wholesale' },
    { id: 'beans-retail', name: 'Beans', variant: 'Retail' },
    { id: 'rice-wholesale', name: 'Rice', variant: 'Wholesale' },
    { id: 'rice-retail', name: 'Rice', variant: 'Retail' }
  ];

  onPlace(row: RowData): void {
    if (row.positionsAvailable <= 0) {
      return;
    }
    this.selectedRow = row;
    this.positions = this.buildPositionSlots(row);
    this.view = 'placement';
  }

  private buildPositionSlots(row: RowData): PositionSlot[] {
    const slotCount = 5; // adjust based on actual layout/capacity per row
    return Array.from({ length: slotCount }, (_, i) => ({
      code: 'P' + (i + 1).toString().padStart(2, '0'),
      items: []
    }));
  }

  // ===== Modal handlers =====
  onAddSlot(slot: PositionSlot, index: number): void {
    this.activeSlot = slot;
    this.activeSlotIndex = index + 1;
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
    if (!this.selectedProductId || !this.activeSlot) {
      return;
    }
    const product = this.productOptions.find(p => p.id === this.selectedProductId);
    if (product) {
      const label = product.variant ? `${product.name} (${product.variant.charAt(0)})` : product.name;
      this.activeSlot.items.push(label);
    }
    this.closeModal();
  }

  removeItem(slot: PositionSlot, index: number): void {
    slot.items.splice(index, 1);
  }

  goBack(): void {
    this.view = 'list';
    this.selectedRow = null;
  }

  onCancel(): void {
    this.goBack();
  }

  onSave(): void {
    if (!this.selectedRow) {
      return;
    }
    console.log('Saving positions for', this.selectedRow, this.positions);
    this.goBack();
  }

  formatRowLabel(rowNumber: number): string {
    return 'Row ' + rowNumber.toString().padStart(2, '0');
  }

  formatSelectedRowLabel(rowNumber: number): string {
    return 'Row ' + rowNumber;
  }
}
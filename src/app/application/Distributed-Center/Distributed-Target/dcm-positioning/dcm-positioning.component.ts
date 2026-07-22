import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RowData {
  rowNumber: number;
  positionsAvailable: number;
}

interface PositionItem {
  label: string;
  locked?: boolean; // true when item has an assigned target and cannot be removed
}

interface PositionSlot {
  code: string;
  items: PositionItem[];
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

  // ===== Save validation state =====
  attemptedSave = false;

  // ===== Add-product modal state =====
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

  // ===== Remove confirm modal state =====
  isRemoveConfirmOpen = false;
  private pendingRemoval: { slot: PositionSlot; index: number; slotPosition: number } | null = null;

  // ===== Action-not-allowed modal state =====
  isActionNotAllowedOpen = false;
  actionNotAllowedMessage = '';

  onPlace(row: RowData): void {
    if (row.positionsAvailable <= 0) {
      return;
    }
    this.selectedRow = row;
    this.positions = this.buildPositionSlots(row);
    this.attemptedSave = false;
    this.view = 'placement';
  }

  private buildPositionSlots(row: RowData): PositionSlot[] {
    const slotCount = 5; // adjust based on actual layout/capacity per row
    return Array.from({ length: slotCount }, (_, i) => ({
      code: 'P' + (i + 1).toString().padStart(2, '0'),
      items: []
    }));
  }

  // ===== Add product modal handlers =====
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
      this.activeSlot.items.push({ label });
    }
    this.closeModal();
  }

  // ===== Remove item flow =====
  requestRemoveItem(slot: PositionSlot, item: PositionItem, index: number, slotPosition: number): void {
    if (item.locked) {
      this.actionNotAllowedMessage =
        `${item.label} from Position ${slotPosition} cannot be removed because ` +
        `${this.formatSelectedRowLabel(this.selectedRow!.rowNumber)} has assigned target.`;
      this.isActionNotAllowedOpen = true;
      return;
    }
    this.pendingRemoval = { slot, index, slotPosition };
    this.isRemoveConfirmOpen = true;
  }

  get pendingRemovalItemLabel(): string {
    if (!this.pendingRemoval) {
      return '';
    }
    return this.pendingRemoval.slot.items[this.pendingRemoval.index]?.label ?? '';
  }

  get pendingRemovalPosition(): number {
    return this.pendingRemoval?.slotPosition ?? 0;
  }

  closeRemoveConfirm(): void {
    this.isRemoveConfirmOpen = false;
    this.pendingRemoval = null;
  }

  confirmRemove(): void {
    if (this.pendingRemoval) {
      this.pendingRemoval.slot.items.splice(this.pendingRemoval.index, 1);
    }
    this.closeRemoveConfirm();
  }

  closeActionNotAllowed(): void {
    this.isActionNotAllowedOpen = false;
    this.actionNotAllowedMessage = '';
  }

  // ===== Validation =====
  isSlotEmpty(slot: PositionSlot): boolean {
    return slot.items.length === 0;
  }

  private getDuplicateLabels(): Set<string> {
    const counts = new Map<string, number>();
    this.positions.forEach(slot =>
      slot.items.forEach(item => {
        counts.set(item.label, (counts.get(item.label) || 0) + 1);
      })
    );
    const duplicates = new Set<string>();
    counts.forEach((count, label) => {
      if (count > 1) {
        duplicates.add(label);
      }
    });
    return duplicates;
  }

  isDuplicateItem(item: PositionItem): boolean {
    return this.getDuplicateLabels().has(item.label);
  }

  hasDuplicateInSlot(slot: PositionSlot): boolean {
    const duplicates = this.getDuplicateLabels();
    return slot.items.some(item => duplicates.has(item.label));
  }

  isSlotInvalid(slot: PositionSlot): boolean {
    if (!this.attemptedSave) {
      return false;
    }
    return this.isSlotEmpty(slot) || this.hasDuplicateInSlot(slot);
  }

  slotErrorMessage(slot: PositionSlot): string {
    if (this.isSlotEmpty(slot)) {
      return 'At least one product is required.';
    }
    if (this.hasDuplicateInSlot(slot)) {
      return 'Duplicate products detected.';
    }
    return '';
  }

  private isFormValid(): boolean {
    return this.positions.every(slot => !this.isSlotEmpty(slot) && !this.hasDuplicateInSlot(slot));
  }

  // ===== Navigation / save =====
  goBack(): void {
    this.view = 'list';
    this.selectedRow = null;
    this.attemptedSave = false;
  }

  onCancel(): void {
    this.goBack();
  }

  onSave(): void {
    this.attemptedSave = true;
    if (!this.isFormValid()) {
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

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

  onAddSlot(slot: PositionSlot): void {
    // TODO: replace with actual picker/modal to select an item to add
    const newItem = prompt('Enter item to add (e.g. Beans (R)):');
    if (newItem) {
      slot.items.push(newItem);
    }
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
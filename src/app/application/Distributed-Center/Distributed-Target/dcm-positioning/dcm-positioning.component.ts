import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RowData {
  rowNumber: number;
  positionsAvailable: number;
}

@Component({
  selector: 'app-dcm-positioning',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dcm-positioning.component.html',
  styleUrl: './dcm-positioning.component.css'
})
export class DcmPositioningComponent {
  rows: RowData[] = [
    { rowNumber: 1, positionsAvailable: 5 },
    { rowNumber: 2, positionsAvailable: 5 },
    { rowNumber: 3, positionsAvailable: 0 }
  ];

  onPlace(row: RowData): void {
    if (row.positionsAvailable <= 0) {
      return;
    }
    // TODO: hook up actual placement logic / navigation here
    console.log('Place clicked for row', row.rowNumber);
  }

  formatRowLabel(rowNumber: number): string {
    return 'Row ' + rowNumber.toString().padStart(2, '0');
  }
}
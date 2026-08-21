import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DistributionProcurementService } from '../../../services/disribution-procuement-service/distribution-procurement.service';
import { CustomDatepickerComponent } from '../../../components/custom-datepicker/custom-datepicker.component';

interface ShortageItem {
  id: number;
  shortageId: number;
  assignedQty: number;
  itemName: string;
  imageUrl: string;
  shortageQty: number;
  unit: string;
  marketPricePerKg: number;
  isAssigned: boolean;
  assignedCentre?: string;
  ceilingPercentage?: number;
  firstAssignedBy?: string;
  finalizedBy?: string;
  createdAt: string;
}

@Component({
  selector: 'app-shortage-history',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    LoadingSpinnerComponent,
    CustomDatepickerComponent
  ],
  templateUrl: './shortage-history.component.html',
  styleUrl: './shortage-history.component.css'
})
export class ShortageHistoryComponent implements OnInit {
  isLoading = false;
  hasData: boolean = true;

  shortageItems: ShortageItem[] = [];
  notAssignedItems: ShortageItem[] = [];
  assignedItems: ShortageItem[] = [];

  selectedDate: string = '';
  maxSelectableDate: string = '';

    currentTime!: Date;
afterSixPm!: boolean;

  // Fallback images for known items — update the paths to match your assets folder
  private readonly itemImageMap: { [key: string]: string } = {
    garlic: 'assets/items/garlic.png',
    turmeric: 'assets/items/turmeric.png',
    watermelon: 'assets/items/watermelon.png',
    'yellow lemon premium': 'assets/items/yellow-lemon.png',
  };

  constructor(
    private router: Router,
    private location: Location,
    private procurementService: DistributionProcurementService,
  ) {}

  ngOnInit(): void {
    // Set yesterday's date in YYYY-MM-DD format (default selected date)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.selectedDate = this.formatDateToYYYYMMDD(yesterday);

    // Max date is TODAY — current date and past dates should be selectable
    const today = new Date();
    this.maxSelectableDate = this.formatDateToYYYYMMDD(today);

    this.currentTime = new Date()
    this.afterSixPm = this.currentTime.getHours() >= 18;

    this.loadShortageHistory();
}

isPrevToday() {
  const selected = new Date(this.selectedDate);
  const today = new Date();

  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return selected < today;
}
  /**
   * Helper method to format Date to YYYY-MM-DD
   */
  private formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Load shortage history for the selected date
   */
  loadShortageHistory(): void {
    this.isLoading = true;

    // Use the selectedDate directly since it's already in YYYY-MM-DD format
    const dateParam = this.selectedDate || undefined;

    this.procurementService.getAllShortageAssignedDetails(dateParam).subscribe({
      next: (response: any[]) => {
        this.shortageItems = (response || []).map((row) => this.mapRowToShortageItem(row));
        this.splitByAssignment();
        this.hasData = this.shortageItems.length > 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading shortage history:', err);
        this.shortageItems = [];
        this.notAssignedItems = [];
        this.assignedItems = [];
        this.hasData = false;
        this.isLoading = false;
      },
    });
  }

  /**
   * Maps a raw DAO row (one row per shortage, or per shortage+assignment
   * combination) into the ShortageItem shape the template expects.
   */
  private mapRowToShortageItem(row: any): ShortageItem {
    const isAssigned = row.id != null; // sa.id is null when a shortage has no assignment row

    const centreParts = [row.regCode, row.centerName].filter(Boolean);

    return {
      id: isAssigned ? row.id : row.shortageId,
      shortageId: row.shortageId,
      assignedQty: Number(row.assignedQty) || 0,
      itemName: row.displayName || '',
      imageUrl: row.image || this.getItemImage(row.displayName),
      shortageQty: Number(row.shortageQty) || 0, // backend already returns the REMAINING qty
      unit: row.unit || 'kg',
      marketPricePerKg: row.buyPrice,
      isAssigned,
      assignedCentre: isAssigned ? centreParts.join(' ') : undefined,
      ceilingPercentage: isAssigned ? row.ceilling : undefined,
      firstAssignedBy: isAssigned ? row.assignedByName : undefined,
      finalizedBy: isAssigned ? row.finalizedByName : undefined,
      createdAt: row.shortageCreatedAt,
    };
  }

  /**
   * Split items into assigned and not-assigned lists
   */
  private splitByAssignment(): void {
    // Assigned table: unchanged — every real assignment record still shows here.
    this.assignedItems = this.shortageItems.filter((item) => item.isAssigned);

    // Not-assigned table: one entry per shortage that STILL has qty left
    // to assign, even if it already has partial assignment(s). A shortage
    // with multiple assignments produces multiple rows in shortageItems,
    // so dedupe by shortageId.
    const seen = new Set<number>();
    this.notAssignedItems = [];

    for (const item of this.shortageItems) {
      if (item.shortageQty <= 0) continue; // fully covered — nothing outstanding
      if (seen.has(item.shortageId)) continue;
      seen.add(item.shortageId);

      this.notAssignedItems.push({
        ...item,
        id: item.shortageId,
        isAssigned: false,
        assignedCentre: undefined,
        ceilingPercentage: undefined,
        firstAssignedBy: undefined,
        finalizedBy: undefined,
      });
    }
  }

  /**
   * Handle date change from the custom datepicker
   */
  onDateChange(newDate: string | Date | null): void {
    if (!newDate) {
      // If null, set to yesterday's date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      this.selectedDate = this.formatDateToYYYYMMDD(yesterday);
    } 
    else if (newDate instanceof Date) {
      // If it's a Date object, format it
      this.selectedDate = this.formatDateToYYYYMMDD(newDate);
    } 
    else if (typeof newDate === 'string') {
      // If it's already a string, check if it's in YYYY-MM-DD format
      // If the custom datepicker returns a Date object as string, parse it
      const parsedDate = new Date(newDate);
      if (!isNaN(parsedDate.getTime())) {
        this.selectedDate = this.formatDateToYYYYMMDD(parsedDate);
      } else {
        // If invalid, use yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        this.selectedDate = this.formatDateToYYYYMMDD(yesterday);
      }
    }
    
    this.loadShortageHistory();
  }

  /**
   * Clear the selected date and load data
   */
  clearDate(): void {
    // Set to yesterday's date instead of null
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.selectedDate = this.formatDateToYYYYMMDD(yesterday);
    this.loadShortageHistory();
  }

  /**
   * Get image URL for an item based on its name
   */
  getItemImage(itemName: string): string {
    const key = (itemName || '').trim().toLowerCase();
    return this.itemImageMap[key] || 'assets/images/items/default-item.png';
  }

  /**
   * Format currency amount
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 2,
    }).format(amount || 0);
  }

  /**
   * Get total records count as padded string
   */
  getTotalRecords(): string {
    return (this.notAssignedItems.length + this.assignedItems.length).toString().padStart(2, '0');
  }

  /**
   * Get not assigned count as padded string
   */
  getNotAssignedCount(): string {
    return this.notAssignedItems.length.toString().padStart(2, '0');
  }

  /**
   * Get assigned count as padded string
   */
  getAssignedCount(): string {
    return this.assignedItems.length.toString().padStart(2, '0');
  }

  /**
   * Truncate text to a max length, appending an ellipsis when cut
   */
  truncateText(value: string | undefined, maxLength: number = 20): string {
    if (!value) return '----';
    return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
  }

  /**
   * Navigate back to previous page
   */
  goBack(): void {
    this.location.back();
  }
}
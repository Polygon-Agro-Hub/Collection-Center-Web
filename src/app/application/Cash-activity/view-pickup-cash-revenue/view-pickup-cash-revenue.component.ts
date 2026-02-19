import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DropdownModule } from 'primeng/dropdown';
import { DistributionServiceService } from '../../../services/Distribution-Service/distribution-service.service';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';
import { CustomDatepickerComponent } from "../../../components/custom-datepicker/custom-datepicker.component";

@Component({
  selector: 'app-view-pickup-cash-revenue',
  standalone: true,
  imports: [LoadingSpinnerComponent, CommonModule, CalendarModule, FormsModule, CustomDatepickerComponent],
  templateUrl: './view-pickup-cash-revenue.component.html',
  styleUrl: './view-pickup-cash-revenue.component.css'
})
export class ViewPickupCashRevenueComponent implements OnInit, OnDestroy {
  isLoading = false;
  centerName: string = '';
  centerRegCode: string = '';
  centerId: string = '';
  searchText: string = '';
  selectedStatus: string = '';
  selectedDate: string | Date | null = null;
  hasData: boolean = false;

  // Data arrays
  revenueData: RevenueItem[] = [];
  filteredRevenueData: RevenueItem[] = [];

  // Remove the searchSubject as we don't need debounce anymore
  private destroy$ = new Subject<void>();

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Picked up', 'Ready to Pickup'];

  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  selectStatusOption(option: string) {
    this.selectedStatus = option;
    this.isStatusDropdownOpen = false;
    this.filterStatus();
  }

  filterStatus() {
    this.loadRevenueData();
  }

  cancelStatus(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectedStatus = '';
    this.loadRevenueData();
  }


  // Summary statistics
  totalAmount: number = 0;
  totalOrders: number = 0;

  constructor(
    private route: ActivatedRoute,
    private distributionSrv: DistributionServiceService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
    this.loadRevenueData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRevenueData(searchText: string = this.searchText, selectDate: string | Date | null = this.selectedDate, status: string = this.selectedStatus): void {
    this.isLoading = true;

    this.distributionSrv
      .getPickupCashRevenue(searchText, selectDate, status)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.status && response.data) {
            this.revenueData = response.data;
            this.filteredRevenueData = [...this.revenueData];
            this.calculateSummary();
            this.hasData = this.revenueData.length > 0;
          } else {
            this.revenueData = [];
            this.filteredRevenueData = [];
            this.hasData = false;
            this.resetSummary();
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error loading revenue data:', error);
          this.revenueData = [];
          this.filteredRevenueData = [];
          this.hasData = false;
          this.resetSummary();
        },
      });
  }
  

  onSearch(): void {
    this.searchText = this.searchText?.trim() || '';
    this.loadRevenueData();
  }

  offSearch() {
    this.searchText = '';
    this.loadRevenueData();

  }

  onDateChange(newDate: string | Date | null) {
    let dateString: string;
  
    if (!newDate) {
      
      dateString = new Date().toISOString().split('T')[0];
    } 
    else if (newDate instanceof Date) {
      
      dateString = newDate.toISOString().split('T')[0];
    } 
    else {
      
      dateString = newDate;
    }
  
    this.selectedDate = dateString;
    this.loadRevenueData();
  }

  onClearSearch(): void {
    this.searchText = '';
    this.loadRevenueData();
  }

  onClearDate(): void {
    this.selectedDate = new Date();
    this.loadRevenueData();
  }

  // You can remove the applyFilters method if it's not used elsewhere
  // applyFilters(): void {
  //   // Apply client-side filtering if needed
  //   // Or reload from server (currently reloading from server)
  //   this.loadRevenueData();
  // }

  private calculateSummary(): void {
  this.totalAmount = this.revenueData.reduce(
    (sum, item) => {
      const price = Number(item.handOverPrice);
      return sum + (!isNaN(price) ? price : 0);
    },
    0,
  );
  this.totalOrders = this.revenueData.length;
}
  private resetSummary(): void {
    this.totalAmount = 0;
    this.totalOrders = 0;
  }

  private formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // Helper method to format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 2,
    }).format(amount);
  }

  // Helper method to format date/time like "11:00 AM June 2, 2025"
  formatDateTime(dateTime: string): string {
    if (!dateTime) return 'N/A';
    
    const date = new Date(dateTime);
    
    // Format time part: 11:00 AM
    const timeString = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    // Format date part: June 2, 2025
    const dateString = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    
    return `${timeString} ${dateString}`;
  }

  // Alternative method if you want exactly "11:00 AM June 2, 2025" format
  formatDateTimeExact(dateTime: string): string {
    if (!dateTime) return 'N/A';
    
    const date = new Date(dateTime);
    
    // Get hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Format time with AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const timeString = `${formattedHours}:${formattedMinutes} ${period}`;
    
    // Month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Get date parts
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${timeString} ${month} ${day}, ${year}`;
  }

  // Helper method to get officer EMP ID
  getOfficerEmpId(item: RevenueItem): string {
    // Return handOverOfficerEmpId if it exists and is not null/empty
    if (item.handOverOfficerEmpId && item.handOverOfficerEmpId.trim() !== '') {
      return item.handOverOfficerEmpId;
    }

    // Otherwise return issuedOfficerEmpId
    if (item.issuedOfficerEmpId && item.issuedOfficerEmpId.trim() !== '') {
      return item.issuedOfficerEmpId;
    }

    // If both are null/empty, return empty string (will show as "N/A" from template)
    return '';
  }

  goBack() {
    this.location.back();
  }
}

interface RevenueItem {
  id: number;
  invNo: string;
  handOverPrice: number;
  handOverTime: string;
  issuedOfficerEmpId: string;
  handOverOfficerEmpId: string;
  status: string;
}

interface CashPrice{
  total_price:number;
  total_orders:number;
}

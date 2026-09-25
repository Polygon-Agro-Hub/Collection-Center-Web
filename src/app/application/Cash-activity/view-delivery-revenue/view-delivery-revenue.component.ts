import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DropdownModule } from 'primeng/dropdown';
import { DistributionServiceService } from '../../../services/Distribution-Service/distribution-service.service';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';
import { CustomDatepickerComponent } from "../../../components/custom-datepicker/custom-datepicker.component";
import { DateAdapter } from 'chart.js';

@Component({
  selector: 'app-view-delivery-revenue',
  standalone: true,
  imports: [LoadingSpinnerComponent, CommonModule, CalendarModule, FormsModule, CustomDatepickerComponent],
  templateUrl: './view-delivery-revenue.component.html',
  styleUrl: './view-delivery-revenue.component.css'
})
export class ViewDeliveryRevenueComponent implements OnInit, OnDestroy {
  isLoading = false;
  centerName: string = '';
  centerRegCode: string = '';
  centerId: string = '';
  searchText: string = '';
  selectedDate: string | Date | null = null;

  selectedStatus: string = '';
  hasData: boolean = false;

  revenueData: RevenueItem[] = [];
  filteredRevenueData: RevenueItem[] = [];

  private destroy$ = new Subject<void>();

  totalAmount: number = 0;
  totalOrders: number = 0;

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Delivered', 'Collected', 'On the way', 'Hold', 'Return', 'Return Received', 'Out For Delivery'];

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

  constructor(
    private route: ActivatedRoute,
    private distributionSrv: DistributionServiceService,
    private location: Location
  ) { }

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
      .getDriverCashRevenue(searchText, selectDate, status)
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

  private calculateSummary(): void {
    this.totalAmount = this.revenueData.reduce(
      (sum, item) => {
        // Only process items with status "Delivered"
        if (item.status === "Delivered" && item.isHandOver === 1) {
          const price = Number(item.handOverPrice);
          return sum + (isNaN(price) ? 0 : price);
        }

        return sum;
      },
      0
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

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 2,
    }).format(amount);
  }

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

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${timeString} ${month} ${day}, ${year}`;
  }

  getOfficerEmpId(item: RevenueItem): string {
    if (item.handOverOfficerEmpId && item.handOverOfficerEmpId.trim() !== '') {
      return item.handOverOfficerEmpId;
    }


    if (item.driverEmpId && item.driverEmpId.trim() !== '') {
      return item.driverEmpId;
    }

    return '';
  }

  goBack() {
    this.location.back();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'bg-[#BBFFC6] text-[#308233]';
      case 'Collected':
        return 'bg-[#F8FEA5] text-[#7E8700]';
      case 'On the way':
        return 'bg-[#FFEDCF] text-[#D17A00]';
      case 'Hold':
        return 'bg-[#FFEDCF] text-[#D17A00]';
      case 'Return':
        return 'bg-[#FFDCDA] text-[#FF1100]';
      case 'Return Received':
        return 'bg-[#FFDCDA] text-[#FF1100]';
      case 'Out For Delivery':
        return 'bg-[#FCD4FF] text-[#80118A]';

      default:
        return 'bg-gray-200 text-gray-700';
    }
  }

  getPriceClass(status: string, isHandOver: number): string {
    if (isHandOver === 1 && status === 'Delivered') {
      return 'text-[#000000] dark:text-textDark';
    } else if (status === 'Return' || status === 'Return Received') {
      return 'text-[#A50000] dark:text-[#A50000]';
    } else {
      return 'text-[#FF0000] dark:text-[#FF0000]';
    }
  }

  getUpdatedTime(item: RevenueItem): Date | null {
    let statusOption = item.status;
    switch (statusOption) {
      case 'Delivered':
        return item.completeTime;
      case 'Collected':
        return item.collectTime;
      case 'On the way':
        return item.onTheWayTime;
      case 'Hold':
        return item.holdTime;
      case 'Return':
        return item.returnTime;
      case 'Return Received':
        return item.returnRecivedTime;
      case 'Out For Delivery':
        return item.outDlvrDate;

      default:
        return null;
    }
  }
}

interface RevenueItem {
  id: number;
  invNo: string;
  handOverPrice: number;
  handOverTime: string;
  driverEmpId: string;
  handOverOfficerEmpId: string;
  status: string;
  collectTime: Date
  holdTime: Date
  onTheWayTime: Date
  returnTime: Date
  returnRecivedTime: Date
  completeTime: Date
  outDlvrDate: Date
  isHandOver: number;
}
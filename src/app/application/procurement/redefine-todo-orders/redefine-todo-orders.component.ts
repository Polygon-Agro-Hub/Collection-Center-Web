import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportServiceService } from '../../../services/Report-service/report-service.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { TokenServiceService } from '../../../services/Token/token-service.service';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';
import { CustomDatepickerComponent } from '../../../components/custom-datepicker/custom-datepicker.component';
import { ProcurementsService } from '../../../services/Procurement-service/procurements.service';

@Component({
  selector: 'app-redefine-todo-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent, SerchableDropdownComponent, CustomDatepickerComponent],
  templateUrl: './redefine-todo-orders.component.html',
  styleUrl: './redefine-todo-orders.component.css'
})
export class RedefineTodoOrdersComponent implements OnInit {

  isLoading = false;
  orders: any[] = [];
  page: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  statusFilter: string = '';
  dateFilter: string = ''; // Changed to Date type for p-calendar
  dateFilter1: string = ''; // Changed to Date type for p-calendar
  deliveryDateFilter: string = '';
  searchTerm: string = '';
  hasData: boolean = false;

  statusOptions = [
    { label: 'Paid', value: 'Paid' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  dateOptions = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
  ];

  constructor(
    private orderService: ProcurementsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(
    ordstatus: string = this.statusFilter,
    dateFilter: string = this.dateFilter,
    dateFilter1: string = this.dateFilter1,
    searchText: string = this.searchTerm
  ): void {
    this.isLoading = true;

    this.orderService
      .getAllOrdersWithProcessInfo(
        this.page,
        this.itemsPerPage,
        ordstatus,
        dateFilter,
        dateFilter1,
        searchText
      )
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.orders = response.data
            this.totalItems = response.total || response.totalCount || 0;
            this.hasData = response.total === 0 ? false : true;
          } else {
            const allOrders = Array.isArray(response) ? response : [];
            this.orders = allOrders
            this.totalItems = this.orders.length;
          }

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching orders:', error);
          this.orders = [];
          this.totalItems = 0;
          this.isLoading = false;
        },
      });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSearch() {
    this.page = 1;
    this.searchTerm = this.searchTerm?.trim() || '';
    this.fetchOrders();
  }

  offSearch() {
    this.searchTerm = '';
    this.fetchOrders();

  }

  onClearSearch(): void {
    this.searchTerm = '';
    this.page = 1;
    this.fetchOrders();
  }

  onFilterChange(): void {
    this.page = 1;
    this.fetchOrders();
  }

  onDateChange(newDate: string | Date | null) {
    let dateString = '';

    if (newDate instanceof Date) {
      // Convert Date object to "YYYY-MM-DD" format
      dateString = newDate.toISOString().split('T')[0];
    } else if (typeof newDate === 'string') {
      // Already a string
      dateString = newDate;
    }

    this.dateFilter1 = dateString; // ✅ assign as string
    this.fetchOrders();
  }

  onDateChange2(newDate: string | Date | null) {
    let dateString = '';

    if (newDate instanceof Date) {
      // Convert Date object to "YYYY-MM-DD" format
      dateString = newDate.toISOString().split('T')[0];
    } else if (typeof newDate === 'string') {
      // Already a string
      dateString = newDate;
    }

    this.dateFilter = dateString; // ✅ assign as string
    this.fetchOrders();
  }

  onPageChange(event: number): void {
    this.page = event;
    this.fetchOrders();
  }



  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  viewPremadePackages(id: number) {
    this.router.navigate(['/procurement/todo-redefine-premade-orders'], {
      queryParams: { id },
    });
  }

  trimLeadingSpaces() {
    if (this.searchTerm.startsWith(' ')) {
      this.searchTerm = this.searchTerm.trimStart();
    }
  }
}
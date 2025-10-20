import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { CustomDatepickerComponent } from '../../../components/custom-datepicker/custom-datepicker.component';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomDatepickerComponent ],
  templateUrl: './my-component.component.html',
  styleUrl: './my-component.component.css'
})
export class MyComponentComponent {
  @ViewChild('fromDatePicker') fromDatePicker!: CustomDatepickerComponent;

  fromDate: string | Date | null = null;
  toDate: string | Date | null = null;
  maxDate: string = new Date().toISOString().split('T')[0];

  constructor(
    private router: Router,
    private toastSrv: ToastAlertService,
  ) { }

  ngOnInit() {
    // Log changes to fromDate for debugging
    setInterval(() => {
      console.log('Current fromDate:', this.fromDate);
    }, 1000);
  }

  onFromDateChange(date: string | Date | null) {
    const selectedDate = date as string || '';
    
    // Validate against max date (today)
    if (selectedDate && selectedDate > this.maxDate) {
      this.fromDate = null;
      
      // Force the datepicker to clear its internal state
      if (this.fromDatePicker) {
        this.fromDatePicker.selectedDate = null;
      }
      
      this.toastSrv.warning("From date cannot be in the future.");
      return;
    }
    
    this.fromDate = selectedDate || null;
    this.validateFromDate();
  }
  
  validateFromDate() {
    if (!this.toDate) {
      return;
    }
  
    if (this.toDate && this.fromDate) {
      const from = new Date(this.fromDate);
      const to = new Date(this.toDate);
  
      if (to <= from) {
        this.toDate = null;
        // Use setTimeout to ensure change detection
        setTimeout(() => {
          this.toastSrv.warning("The 'To' date has been cleared because it was earlier than or same as the new 'From' date.");
        });
      }
    }
  }

}

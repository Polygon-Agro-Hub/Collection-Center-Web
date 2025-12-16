import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-datepicker.component.html',
  styleUrl: './custom-datepicker.component.css'
})
export class CustomDatepickerComponent {

  private _selectedDate: string | Date | null = null;
  
  @Input() 
  set selectedDate(value: string | Date | null) {
    this._selectedDate = value === '' ? null : value;
  }
  get selectedDate(): string | Date | null {
    return this._selectedDate;
  }
  
  @Output() selectedDateChange = new EventEmitter<string | Date | null>();
  @Output() dateChange = new EventEmitter<string | Date | null>();
  @Input() placeholder: string = 'Date';
  @Input() showClearButton: boolean = true;
  @Output() pickerOpened = new EventEmitter<void>();
  
  showCalendar = false;
  showYearPicker = false;

  currentMonth: number;
  currentYear: number;
  calendarDays: { date: number; currentMonth: boolean; fullDate: Date }[] = [];
  yearRange: number[] = [];

  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  constructor() {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
    this.showYearPicker = false;

    if (this.showCalendar) {
      this.pickerOpened.emit(); // 👈 track click/open
    }
    
    // Reset to current date or selected date when opening
    if (this.showCalendar) {
      if (this.selectedDate) {
        const date = new Date(this.selectedDate);
        this.currentMonth = date.getMonth();
        this.currentYear = date.getFullYear();
      } else {
        const today = new Date();
        this.currentMonth = today.getMonth();
        this.currentYear = today.getFullYear();
      }
      this.generateCalendar(this.currentMonth, this.currentYear);
    }
  }

  toggleYearPicker() {
    this.showYearPicker = !this.showYearPicker;
    if (this.showYearPicker) {
      this.generateYearRange();
    }
  }
  

  generateYearRange() {
    // Generate 5 years before and after current year (11 years total)
    const startYear = this.currentYear - 5;
    this.yearRange = [];
    for (let i = 0; i < 11; i++) {
      this.yearRange.push(startYear + i);
    }
  }

  selectYear(year: number) {
    this.currentYear = year;
    this.showYearPicker = false;
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  prevYearRange() {
    this.currentYear -= 11;
    this.generateYearRange();
  }

  nextYearRange() {
    this.currentYear += 11;
    this.generateYearRange();
  }

  clearDate(event: Event) {
    event.stopPropagation();
    this._selectedDate = null;
    this.selectedDateChange.emit(this._selectedDate);
    this.dateChange.emit(this._selectedDate);
    this.showCalendar = false;
    console.log('date cleared');
  }

  selectDate(day: any) {
    console.log('day', day);
    const d = day.fullDate;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');

    this.selectedDate = `${year}-${month}-${date}`;
    console.log('selectedDate', this.selectedDate);
    this.selectedDateChange.emit(this.selectedDate);
    this.dateChange.emit(this.selectedDate);
    this.showCalendar = false;
  }

  isSelected(day: any): boolean {
    if (!this.selectedDate) return false;
  
    const d = day.fullDate;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    const dayStr = `${year}-${month}-${date}`;
  
    const dateToCompare = typeof this.selectedDate === 'string' 
      ? this.selectedDate 
      : null;
      
    return dateToCompare === dayStr;
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  generateCalendar(month: number, year: number) {
    this.calendarDays = [];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      this.calendarDays.push({
        date: prevMonthDays - i,
        currentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthDays - i)
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push({
        date: i,
        currentMonth: true,
        fullDate: new Date(year, month, i)
      });
    }

    while (this.calendarDays.length < 42) {
      const nextDate = this.calendarDays.length - (firstDay + daysInMonth) + 1;
      this.calendarDays.push({
        date: nextDate,
        currentMonth: false,
        fullDate: new Date(year, month + 1, nextDate)
      });
    }
  }
}
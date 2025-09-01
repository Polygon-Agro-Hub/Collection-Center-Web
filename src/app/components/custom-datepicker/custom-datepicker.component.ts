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

  @Input() selectedDate: string | Date | null = null;
@Output() selectedDateChange = new EventEmitter<string | Date | null>();
@Output() dateChange = new EventEmitter<string | Date | null>();
  

  showCalendar = false;

  currentMonth: number;
  currentYear: number;
  calendarDays: { date: number; currentMonth: boolean; fullDate: Date }[] = [];

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
  }

  clearDate(event: Event) {
    event.stopPropagation();
    this.selectedDate = '';
    this.dateChange.emit(this.selectedDate);
    this.showCalendar = false;
  }

  selectDate(day: any) {
    const d = day.fullDate;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');

    this.selectedDate = `${year}-${month}-${date}`;
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

    return this.selectedDate === dayStr;
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

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      this.calendarDays.push({
        date: prevMonthDays - i,
        currentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthDays - i)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push({
        date: i,
        currentMonth: true,
        fullDate: new Date(year, month, i)
      });
    }

    // Fill next month to complete 6 rows
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

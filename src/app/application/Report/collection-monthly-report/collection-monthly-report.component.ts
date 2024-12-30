import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-collection-monthly-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './collection-monthly-report.component.html',
  styleUrl: './collection-monthly-report.component.css'
})
export class CollectionMonthlyReportComponent {
  hasData: boolean = true;

}

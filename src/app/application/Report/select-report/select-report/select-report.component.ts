import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CollectionReportComponentComponent } from '../collection-report-component/collection-report-component.component';
import { SalesReportComponentComponent } from '../sales-report-component/sales-report-component.component';
import { SerchableDropdownComponent } from '../../../../components/serchable-dropdown/serchable-dropdown.component';

@Component({
  selector: 'app-select-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CollectionReportComponentComponent,
    SalesReportComponentComponent,
    SerchableDropdownComponent
  ],
  templateUrl: './select-report.component.html',
  styleUrl: './select-report.component.css',
})
export class SelectReportComponent {
  selectedtype: string = '';
  type: string = '';
  reportType: string = '';

  GoBtn() {
    this.type = this.reportType;
  }

  clearSelection() {
    this.reportType = '';
    this.type = '';
  }


  get categoryDropdownItems() {
    return [
      {
        value: "Collection Reports",
        label: "Collection Reports"
      }
    ];
  }

  // 5. Add selection change handler
  onCategorySelectionChange(selectedValue: string) {
    this.reportType = selectedValue || '';
  }

}

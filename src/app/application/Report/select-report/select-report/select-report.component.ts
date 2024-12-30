import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CollectionReportComponentComponent } from '../collection-report-component/collection-report-component.component';
import { SalesReportComponentComponent } from '../sales-report-component/sales-report-component.component';

@Component({
  selector: 'app-select-report',
  standalone: true,
  imports: [CommonModule, FormsModule, CollectionReportComponentComponent, SalesReportComponentComponent],
  templateUrl: './select-report.component.html',
  styleUrl: './select-report.component.css'
})
export class SelectReportComponent {
  selectedtype: string = ''
  type:string = '';

  GoBtn(){
    this.type = this.selectedtype
  }
  

}

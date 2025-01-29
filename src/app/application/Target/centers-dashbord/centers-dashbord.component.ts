import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-centers-dashbord',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './centers-dashbord.component.html',
  styleUrl: './centers-dashbord.component.css'
})
export class CentersDashbordComponent {
  selectTable: string = 'collection';

  chooseTable(table: string) {
    this.selectTable = table;
  }

}

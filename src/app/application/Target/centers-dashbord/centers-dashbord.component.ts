import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-centers-dashbord',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './centers-dashbord.component.html',
  styleUrl: './centers-dashbord.component.css'
})
export class CentersDashbordComponent {
  constructor(private router: Router,
  ) {

  }
  selectTable: string = 'collection';

  chooseTable(table: string) {
    this.selectTable = table;
  }

  navigatePath(path:string){
    this.router.navigate([path]);
  }



}

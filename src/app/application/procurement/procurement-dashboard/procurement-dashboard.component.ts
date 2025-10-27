import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-procurement-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './procurement-dashboard.component.html',
  styleUrl: './procurement-dashboard.component.css'
})
export class ProcurementDashboardComponent {

  constructor(
    private router: Router
  ) {

  }
  isRedefineClicked: boolean = false;
  isAllRecievedClicked: boolean = false;

  onRedefineClick() {
    this.isRedefineClicked = true;
    this.isAllRecievedClicked = false;
    this.navigateToRedefine();
  }

  onAllRecievedClick() {
    this.isAllRecievedClicked = true;
    this.isRedefineClicked = false;
    this.navigateToAllRecieved();
  }

  navigateToRedefine() {
    if (this.isRedefineClicked) {
      this.router.navigate(['procurement/redefine-orders']);
    }
  }

  navigateToAllRecieved() {
    if (this.isAllRecievedClicked) {
      this.router.navigate(['procurement/officer-reports']);
    }
  }


}


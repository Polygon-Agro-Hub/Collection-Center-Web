import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-distribution-procurement-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './distribution-procurement-dashboard.component.html',
  styleUrl: './distribution-procurement-dashboard.component.css'
})
export class DistributionProcurementDashboardComponent {

  constructor(
    private router: Router
  ) {

  }
  isProductShortageTodayClicked: boolean = false;
  isProductShortageHistoryClicked: boolean = false;
  isProductShortageFinalizationClicked: boolean = false;

  onProductShortageTodayClick() {
    this.isProductShortageTodayClicked = true;
    this.isProductShortageHistoryClicked = false;
    this.isProductShortageFinalizationClicked = false;
    this.navigateToProductShortageToday();
  }

  onProductShortageHistoryClick() {
    this.isProductShortageTodayClicked = false;
    this.isProductShortageHistoryClicked = true;
    this.isProductShortageFinalizationClicked = false;
    this.navigateToProductShortageHistory();
  }

  onProductShortageFinaliztionClick() {
    this.isProductShortageTodayClicked = false;
    this.isProductShortageHistoryClicked = false;
    this.isProductShortageFinalizationClicked = true;
    this.navigateToFinaization();
  }

  navigateToProductShortageToday() {
    if (this.isProductShortageTodayClicked) {
      this.router.navigate(['/distribution-procurement/shortage-today']);
    }
  }

  navigateToProductShortageHistory() {
    if (this.isProductShortageHistoryClicked) {
      this.router.navigate(['/distribution-procurement/shortage-finalization-today']);
    }
  }

  navigateToFinaization() {
    if (this.isProductShortageFinalizationClicked) {
      this.router.navigate(['/distribution-procurement/shortage-history']);
    }
  }


}
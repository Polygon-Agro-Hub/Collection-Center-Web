import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-storage-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-storage-dashboard.component.html',
  styleUrl: './product-storage-dashboard.component.css'
})
export class ProductStorageDashboardComponent {

  constructor(
    private router: Router
  ) {

  }
  isProductShortageTodayClicked: boolean = false;
  isProductShortageHistoryClicked: boolean = false;

  onProductShortageTodayClick() {
    this.isProductShortageTodayClicked = true;
    this.isProductShortageHistoryClicked = false;
    this.navigateToProductShortageToday();
  }

  onProductShortageHistoryClick() {
    this.isProductShortageTodayClicked = false;
    this.isProductShortageHistoryClicked = true;
    this.navigateToProductShortageHistory();
  }

  navigateToProductShortageToday() {
    if (this.isProductShortageTodayClicked) {
      this.router.navigate(['product-shortage/product-shortage-today']);
    }
  }

  navigateToProductShortageHistory() {
    if (this.isProductShortageHistoryClicked) {
      this.router.navigate(['product-shortage/product-shortage-history']);
    }
  }


}


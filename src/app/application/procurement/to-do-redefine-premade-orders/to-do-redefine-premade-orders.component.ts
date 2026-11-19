import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DropdownModule } from 'primeng/dropdown';
import { ProcurementsService } from '../../../services/Procurement-service/procurements.service';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';

interface AdditionalItem {
  id: number;
  qty: number;
  unit: string;
  displayName: string;
  quantity?: number; // Optional if you want to allow editing
}

interface OrderDetailItem {
  packageId: number;
  displayName: string;
  productPrice: number;
  invNo: string;
  productTypes: ProductTypes[];
}

interface ProductTypes {
  id: number;
  typeName: string;
  shortCode: string;
  productId: number | null;
  selectedProductPrice?: number;
  quantity?: number; // Add this
  calculatedPrice?: number; // Add this
}

interface MarketplaceItem {
  id: number;
  displayName: string;
  normalPrice: number;
  discountedPrice: number;
  category: string;
  changeby: string;
  discount: string;
  isExcluded: boolean;
  isEnabled: number;
  startValue: string;
  unitType: string;
  varietyId: number;
  productTypeId: number;
}

interface PackageItem {
  packageId: number;
  displayName: string;
  productPrice: number;
  productTypes: ProductTypes[];
}

@Component({
  selector: 'app-to-do-redefine-premade-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, DropdownModule, SerchableDropdownComponent],
  templateUrl: './to-do-redefine-premade-orders.component.html',
  styleUrl: './to-do-redefine-premade-orders.component.css'
})
export class ToDoRedefinePremadeOrdersComponent implements OnInit, OnDestroy {

  orderdetailsArr: OrderDetails[] = [];
  excludeItemsArr: ExcludeItems[] = [];
  preferItemsArr: PreferedItems[] = [];
  orderDetails: OrderDetailItem[] = [];
  marketplaceItems: MarketplaceItem[] = [];
  additionalItems: AdditionalItem[] = [];
  categories: Categories[] = [];
  loading = true;
  error = '';
  invoiceNumber = '';
  totalPrice = 0;
  orderId!: number;
  isWithinLimit = true;

  showAdditionalItemsModal = false;
  showExcludedItemsModal = false;
  isNewAddPopUp: boolean = false
  excludedItemsCount!: number;
  preferItemsCount!: number;
  additionalItemsCount!: number;


  totalDefinePkgPrice: number = 0.00;

  totalPackagePrice: number = 0.00;

  selectedOption: string = '';

  isLoading: boolean = true;

  // Prevents dispatching the same order more than once
  isDispatching: boolean = false;

  selectPackageId: number | string = '';
  selectCategoryId: number | string = '';
  newItem: OrderItem = new OrderItem();
  limitMassage: string = '';

  // Auto-dispatch countdown pop-up
  readonly DISPATCH_COUNTDOWN_SECONDS = 30;
  readonly dispatchRingRadius = 70;
  readonly dispatchRingCircumference = 2 * Math.PI * 70;
  showDispatchModal = false;
  dispatchCountdown = 30;
  private dispatchTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private procurementService: ProcurementsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  goBack(): void {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You may lose the added data after going back!',
      showCancelButton: true,
      confirmButtonText: 'Yes, Go Back',
      cancelButtonText: 'No, Stay Here',
      customClass: {
        popup: 'bg-tileLight dark:bg-tileBlack text-black dark:text-white',
        title: 'font-semibold',
      },
      buttonsStyling: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Only go back if user confirms
        window.history.back();
      }
      // If user clicks "No" or dismisses, the modal will automatically close
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.error = 'No order ID provided in URL';
        this.loading = false;
        return;
      }

      this.orderId = Number(id);

      // First fetch marketplace items
      this.fetchMarketplaceItems(() => {
        // Then fetch order details
        this.fetchOrderDetails(id);
      });
    });

  }
  isExcluded(product: MarketplaceItem): boolean {
    return product.isExcluded;
  }
  onSelectionChange() {
  }

  getSelectedOptionText(): string {
    switch (this.selectedOption) {
      case 'option1': return 'First Option';
      case 'option2': return 'Second Option';
      case 'option3': return 'Third Option';
      default: return '';
    }
  }

  fetchMarketplaceItems(callback?: () => void) {
    this.loading = true;
    this.procurementService.getAllMarketplaceItems(this.orderId).subscribe({
      next: (data: any) => {
        this.marketplaceItems = data.items.map((item: any) => ({
          id: item.id,
          displayName: item.displayName,
          normalPrice: item.normalPrice,
          discountedPrice: item.discountedPrice,
          isExcluded: item.isExcluded,
          isEnabled: item.isEnabled,
          productTypeId: item.productTypeId,

        }));
        if (callback) callback();
      },

      error: (err) => {
        console.error('Error fetching marketplace items:', err);
        this.error = 'Failed to load product options';
        if (callback) callback();
      },
    });
    this.loading = false;
  }

  fetchOrderDetails(id: string) {
    this.loading = true;
    this.error = '';
    this.isLoading = true;

    this.procurementService.getOrderDetailsById(id).subscribe(
      (response) => {

        this.orderdetailsArr = response.data;
        this.additionalItems = response.additionalItems;
        this.excludeItemsArr = response.excludeList;
        this.preferItemsArr = response.preferedList;
        this.excludedItemsCount = response.excludeList.length;
        this.preferItemsCount = response.preferedList.length;
        this.categories = response.category;
        this.additionalItemsCount = response.additionalItems.length || 0;


        // ✅ Reset totals
        this.totalDefinePkgPrice = 0.00;
        this.totalPackagePrice = 0.00;

        this.orderdetailsArr.forEach(order => {
          let packageTotal = 0.00;

          // ✅ Sum package's productPrice for totalPackagePrice
          this.totalPackagePrice += order.productPrice ?? 0;

          order.items.forEach(item => {
            const selectedProduct = this.marketplaceItems.find(
              product => +product.id === +item.productId
            );
            item.isExcluded = selectedProduct?.isExcluded ?? false;
            item.isEnabled = selectedProduct?.isEnabled ?? 1;

            const qty = item.qty ?? 0;
            const discountedPrice = selectedProduct?.discountedPrice ?? 0;

            // item.price = discountedPrice * qty;
            packageTotal += item.price;
          });

          this.sortItemsAlphabetically(order.items);

          order.definePkgPrice = packageTotal;
          this.totalDefinePkgPrice += packageTotal;
        });

        this.calculateTotalPrice();

        this.loading = false;
        this.isLoading = false;

      },
      (error) => {
        console.error('Error fetching order details:', error);
      }
    );
  }

  // Transform marketplace items to dropdown format
  getMarketplaceDropdownItems(typeId: number) {

    const prfIds = this.preferItemsArr.map(p => p.id);
    const exlIds = this.excludeItemsArr.map(e => e.id);

    const isExcludedItem = (item: MarketplaceItem) => (item.isExcluded || exlIds.includes(item.id));
    const isDisabledItem = (item: MarketplaceItem) => !isExcludedItem(item) && item.isEnabled === 0;
    const isPreferredItem = (item: MarketplaceItem) => !isExcludedItem(item) && !isDisabledItem(item) && prfIds.includes(item.id);

    const toItem = (item: MarketplaceItem) => {
      const isExcluded = isExcludedItem(item);
      const isDisabled = isDisabledItem(item);
      const isPreferred = isPreferredItem(item);

      let iconClass = 'fa-solid fa-check text-blue-500';
      if (isExcluded) {
        iconClass = 'fa-solid fa-ban text-red-500';
      } else if (isDisabled) {
        iconClass = 'fa-solid fa-triangle-exclamation text-orange-500';
      } else if (isPreferred) {
        iconClass = 'fa-solid fa-heart text-green-500';
      }

      return {
        value: item.id.toString(),
        label: item.displayName,
        disabled: isExcluded || isDisabled,
        iconClass
      };
    };

    const filteredMarketplaceItems = this.marketplaceItems.filter(item => item.productTypeId === typeId);

    const preferredItems = filteredMarketplaceItems.filter(isPreferredItem).map(toItem);
    const normalItems = filteredMarketplaceItems.filter(item => !isPreferredItem(item) && !isExcludedItem(item) && !isDisabledItem(item)).map(toItem);
    const excludedItems = filteredMarketplaceItems.filter(isExcludedItem).map(toItem);
    const disabledItems = filteredMarketplaceItems.filter(isDisabledItem).map(toItem);

    return [...preferredItems, ...normalItems, ...excludedItems, ...disabledItems];
  }

  // Get the string value for the dropdown
  getProductValue(item: any): string {
    return item.productId ? item.productId.toString() : '';
  }

  // Handle product selection change
  onProductSelectionChange(selectedValue: string, item: any) {
    // Convert string back to number if needed
    item.productId = selectedValue ? parseInt(selectedValue, 10) : null;

    // Call your existing calculatePrice method
    this.calculatePrice(item);

  }



  calculatePrice(item: OrderItem): void {
    const selectedProduct = this.marketplaceItems.find(
      product => +product.id === +item.productId
    );

    if (selectedProduct) {
      const price = selectedProduct.discountedPrice ?? 0;
      const qty = item.qty ?? 0;

      item.price = price * qty;


      item.isExcluded = selectedProduct.isExcluded;
      item.isEnabled = selectedProduct.isEnabled;
    } else {
      item.price = 0;
      item.isExcluded = false; // fallback
      item.isEnabled = 1; // fallback
    }


    this.recalculatePackageTotal();
  }



  recalculatePackageTotal(): void {
    this.totalDefinePkgPrice = 0.00;
    this.totalPackagePrice = 0.00;

    this.orderdetailsArr.forEach((pkg: OrderDetails) => {
      // Sum up the definePkgPrice using item prices
      pkg.definePkgPrice = pkg.items.reduce((total, item) => {
        return total + (+item.price || 0);
      }, 0);

      this.totalDefinePkgPrice += pkg.definePkgPrice;

      // Sum up the original productPrice per package
      this.totalPackagePrice += +pkg.productPrice || 0;
    });

    // Compare against 1.08 * totalPackagePrice
    const limit = 1.08 * this.totalPackagePrice;

    this.isWithinLimit =
      this.totalPackagePrice <= this.totalDefinePkgPrice &&
      this.totalDefinePkgPrice <= limit;


    if (this.totalDefinePkgPrice < this.totalPackagePrice) {
      this.limitMassage = `The calculated price is below the minimum limit of Rs.${this.totalPackagePrice.toFixed(2)}. To save the order, the calculated price must be equal to or within 8% above the target price.`
    } else if (this.totalDefinePkgPrice > limit) {
      this.limitMassage = `The calculated price exceeds the allowed limit ( ${this.totalPackagePrice.toFixed(2)} + ${this.totalPackagePrice.toFixed(2)} x 8% = Rs.${limit.toFixed(2)} ). To save the order, it must be within 8% of the target price.`
    } else {
      this.limitMassage = `Allowed limit: ${this.totalPackagePrice.toFixed(2)} + ${this.totalPackagePrice.toFixed(2)} x 8% = Rs.${limit.toFixed(2)}.`
    }

  }




  calculateTotalPrice() {
    if (this.orderdetailsArr && this.orderdetailsArr.length) {
      this.totalPrice = this.getCombinedProductPrice();

      // Calculate the allowed limit (8% of the total price)
      const allowedLimit = this.totalPrice * 1.08;

      // Calculate the current total (sum of all package totals)
      const currentTotal = this.orderdetailsArr.reduce(
        (sum: number, pkg: OrderDetails) =>
          sum + pkg.items.reduce((pkgSum, item) => pkgSum + (+item.price || 0), 0),
        0
      );

       this.isWithinLimit =
      this.totalPrice <= currentTotal &&
      currentTotal <= allowedLimit;
    const minLimitText = this.totalPrice.toFixed(2);

    if (currentTotal < this.totalPrice) {
      this.limitMassage = `The calculated price is below the minimum limit of Rs.${minLimitText}. To save the order, the calculated price must be equal to or within 8% above the target price.`
    } else if (currentTotal > allowedLimit) {
      this.limitMassage = `The calculated price exceeds the allowed limit ( ${minLimitText} + ${minLimitText} x 8% = Rs.${allowedLimit.toFixed(2)} ). To save the order, it must be within 8% of the target price.`
    } else {
      this.limitMassage = `Allowed limit: ${minLimitText} + ${minLimitText} x 8% = Rs.${allowedLimit.toFixed(2)}.`
    }

    } else {
      this.totalPrice = 0;
      this.isWithinLimit = true;
    }
  }

  onProductSelected(productType: ProductTypes, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedProductId = Number(selectElement.value);

    // Find the selected product
    const selectedProduct = this.marketplaceItems.find(
      (item) => item.id === selectedProductId
    );

    if (selectedProduct) {
      productType.productId = selectedProduct.id;
      productType.selectedProductPrice = selectedProduct.discountedPrice;
      // Set calculated price to normal price by default (for 1 unit)
      productType.calculatedPrice = selectedProduct.discountedPrice;
    } else {
      productType.productId = null;
      productType.selectedProductPrice = 0;
      productType.calculatedPrice = 0;
    }
    productType.quantity = undefined; // Reset quantity
  }

  onQuantityChanged(productType: ProductTypes, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const quantity = parseFloat(inputElement.value);

    if (isNaN(quantity)) {
      productType.quantity = undefined;
      productType.calculatedPrice = productType.selectedProductPrice || 0;
    } else {
      productType.quantity = quantity;
      productType.calculatedPrice =
        quantity * (productType.selectedProductPrice || 0);
    }
    this.calculateTotalPrice(); // Add this line
  }

  getPackageTotal(packageItem: OrderDetailItem): number {
    if (!packageItem.productTypes) return 0;

    return packageItem.productTypes.reduce((sum, productType) => {
      return sum + (productType.calculatedPrice || 0);
    }, 0);
  }

  getAllowedLimit(packageItem: OrderDetailItem): string {
    const allowedLimit = packageItem.productPrice * 1.08;
    return allowedLimit.toFixed(2);
  }

  // Runs all product/quantity checks; shows a warning and returns false if anything is invalid
  private validateBeforeDispatch(): boolean {
    const hasInvalidProduct = this.orderdetailsArr.some((pkg, pkgIndex) => {
      return pkg.items.some((item, itemIndex) => {
        return (
          (item.productId === null || item.productId === undefined || item.productId === null || Number.isNaN(item.productId)) && (item.qty === 0 || item.qty === null)
        );
      });
    });

    const hasInvalidItem = this.orderdetailsArr.some((pkg, pkgIndex) => {
      return pkg.items.some((item, itemIndex) => {
        return (
          (item.productId === null || item.productId === undefined || item.productId === null || Number.isNaN(item.productId))
        );
      });
    });

    const hasInvalidQty = this.orderdetailsArr.some((pkg, pkgIndex) => {
      return pkg.items.some((item, itemIndex) => {
        return (
          (item.qty === 0 || item.qty === null)
        );
      });
    });

    const hasExcludeProduct = this.orderdetailsArr.some((pkg, pkgIndex) => {
      return pkg.items.some((item, itemIndex) => {
        return item.isExcluded === true;
      });
    });

    const hasDisabledProduct = this.orderdetailsArr.some((pkg, pkgIndex) => {
      return pkg.items.some((item, itemIndex) => {
        return item.isEnabled === 0;
      });
    });

    if (hasInvalidProduct) {
      this.loading = false;
      // Swal.fire('Missing Product', 'Please select products for all inputs before submitting.', 'warning');
      Swal.fire({
        title: 'Missing or Invalid Information',
        text: 'Product & Quantity are missing.',
        icon: 'warning',
        customClass: {
          popup: 'bg-tileLight dark:bg-tileBlack text-black dark:text-white',
          title: 'font-semibold',
        }
      });
      return false;
    } else if (hasInvalidItem) {
      this.loading = false;
      Swal.fire({
        title: 'Missing or Invalid Information',
        text: 'Product is missing.',
        icon: 'warning',
        customClass: {
          popup: 'bg-tileLight dark:bg-tileBlack text-black dark:text-white',
          title: 'font-semibold',
        }
      });
      return false;
    } else if (hasInvalidQty) {
      this.loading = false;
      Swal.fire({
        title: 'Missing or Invalid Information',
        text: 'Quantity is missing.',
        icon: 'warning',
        customClass: {
          popup: 'bg-tileLight dark:bg-tileBlack text-black dark:text-white',
          title: 'font-semibold',
        }
      });
      return false;
    } else if (hasExcludeProduct) {
      this.loading = false;
      // Swal.fire('Invalid Product', 'Please Do not Select Excluded products.', 'warning');
      Swal.fire({
        title: 'Invalid Product',
        text: 'Please, do not select excluded products.',
        icon: 'warning',
        customClass: {
          popup: 'bg-tileLight dark:bg-tileBlack text-black dark:text-white',
          title: 'font-semibold',
        }
      });
      return false;
    } else if (hasDisabledProduct) {
      this.loading = false;
      Swal.fire({
        title: 'Invalid Product',
        text: 'Please, do not select disabled products.',
        icon: 'warning',
        customClass: {
          popup: 'bg-tileLight dark:bg-tileBlack text-black dark:text-white',
          title: 'font-semibold',
        }
      });
      return false;
    }

    return true;
  }

  onComplete() {
    if (this.isDispatching) {
      return; // already sent — prevent a second dispatch
    }
    if (!this.validateBeforeDispatch()) {
      return;
    }

    this.isDispatching = true;
    this.loading = true;

    this.procurementService.updateDefinePackageItemData(this.orderdetailsArr, this.orderId).subscribe(
      (res) => {
        this.loading = false;
        // isDispatching stays true: the order is dispatched and must not be sent again

        // Show success message and redirect to the dispatched order view
        Swal.fire({
          title: 'Success!',
          text: 'The order has been dispatched successfully.',
          icon: 'success',
          confirmButtonColor: '#415CFF',
          allowOutsideClick: false,
          allowEscapeKey: false,
          customClass: {
            popup: 'bg-tileLight dark:bg-tileBlack text-black dark:text-white',
            title: 'font-semibold',
          },
        }).then(() => {
          this.router.navigate(['/procurement/view-dispatched-define-orders'], {
            queryParams: { id: this.orderId },
            replaceUrl: true,
          });
        });
      },
      (err) => {
        this.loading = false;
        this.isDispatching = false; // allow retry on failure
        console.error('Update failed:', err);
        // Swal.fire('Error', 'Product Update Unsuccessful', 'error');
        Swal.fire({
          title: 'Error',
          text: 'Product Update Unsuccessful',
          icon: 'error',
          customClass: {
            popup: 'bg-tileLight dark:bg-tileBlack text-black dark:text-white',
            title: 'font-semibold',
          }
        });
      }
    );
  }


  private getErrorMessage(error: any): string {
    if (error?.error?.message) {
      return error.error.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'Unknown error occurred';
  }

  private saveItemsSequentially(items: any[], index = 0) {
    if (index >= items.length) {
      this.loading = false;
      alert('All items saved successfully!');
      this.goBack();
      return;
    }

    // Provide an empty array or appropriate products array as the second argument
    this.procurementService
      .createOrderPackageItems(items[index], [])
      .subscribe({
        next: () => {
          this.saveItemsSequentially(items, index + 1);
        },
        error: (err) => {
          console.error(`Error saving item ${index}:`, err);
          this.loading = false;
          alert(`Failed to save item ${index + 1}. Please try again.`);
        },
      });
  }

  getCombinedProductPrice(): number {
    if (!this.orderdetailsArr || this.orderdetailsArr.length === 0) {
      return 0;
    }

    // Sum of all package product prices
    return this.orderdetailsArr.reduce(
      (sum, pkg) => sum + (pkg.productPrice || 0),
      0
    );
  }

  getCombinedCalculatedTotal(): number {
    if (!this.orderDetails || this.orderDetails.length === 0) {
      return 0;
    }

    // Sum of all package calculated totals
    return this.orderDetails.reduce(
      (sum, pkg) => sum + this.getPackageTotal(pkg),
      0
    );
  }

  openAdditionalItemsModal() {
    this.showAdditionalItemsModal = true;
  }

  closeAdditionalItemsModal() {
    this.showAdditionalItemsModal = false;
  }

  openExcludedItemsModal() {
    this.showExcludedItemsModal = true;
  }

  closeExcludedItemsModal() {
    this.showExcludedItemsModal = false;
  }

  OpenAddNewItemPopUp(id: number) {
    this.selectPackageId = id;
    this.isNewAddPopUp = true;
  }

  closeAddNewItemPopUp() {
    this.isNewAddPopUp = false;
    this.selectPackageId = '';
    this.selectCategoryId = ''; // Add this line to clear the dropdown
  }

  addNewItems() {
    // Find the order detail that matches the selected packageId
    const selectedOrderDetail = this.orderdetailsArr.find(
      detail => detail.packageId.toString() === this.selectPackageId.toString()
    );

    if (!selectedOrderDetail) {
      console.error('No matching package found');
      return;
    }

    const selectedCategory = this.categories.find(
      cat => cat.id.toString() === this.selectCategoryId.toString()
    );

    if (!selectedCategory) {
      console.error('No matching category found');
      return;
    }

    if (!this.newItem.qty) {
      this.newItem.qty = 0;
    }

    this.newItem.productTypeId = Number(this.selectCategoryId);
    this.newItem.productName = selectedCategory.typeName;
    this.newItem.productTypeShortCode = selectedCategory.shortCode;

    const existingItemIndex = selectedOrderDetail.items.findIndex(
      item => item.productId === this.newItem.productId &&
        item.productTypeId === this.newItem.productTypeId
    );

    if (existingItemIndex !== -1) {
      selectedOrderDetail.items[existingItemIndex] = { ...this.newItem };
    } else {
      selectedOrderDetail.items.push({ ...this.newItem });
    }

    this.newItem = new OrderItem();

    this.sortItemsAlphabetically(selectedOrderDetail.items);
    this.isNewAddPopUp = false;
  }

  // Sort package items alphabetically by category short code (A → Z)
  sortItemsAlphabetically(items: OrderItem[]) {
    items.sort((a, b) =>
      (a.productTypeShortCode || '').localeCompare(b.productTypeShortCode || '', undefined, { sensitivity: 'base' })
    );
  }

  validateQuantity(item: any) {
    // Ensure quantity is not negative
    if (item.qty < 0) {
      item.qty = 0;
    }
    this.calculatePrice(item);
  }

  preventNegativeInput(event: KeyboardEvent) {
    // Prevent minus key (-) from being entered
    if (event.key === '-' || event.key === 'Subtract') {
      event.preventDefault();
    }
  }

  goToCompleteTab() {
    this.router.navigate(['/procurement/define-packages'], {
      queryParams: { tab: 'completed' }
    });
  }

  confirmClear() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will clear all your changes. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3980C0',
      cancelButtonColor: '#74788D',
      confirmButtonText: 'Yes, clear it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'bg-tileLight dark:bg-[#363636] text-black dark:text-white',
        title: 'font-semibold',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.clearForm();
        // this.recalculatePackageTotal();
      }
    });
  }

  confirmComplete() {
    // Only show confirmation if within limit
    if (!this.isWithinLimit || this.isDispatching) {
      return;
    }

    // Validate first so the user isn't made to wait 30s only to see an error
    if (!this.validateBeforeDispatch()) {
      return;
    }

    this.openDispatchCountdown();
  }

  // ---------- Auto-dispatch countdown pop-up ----------

  get dispatchCountdownLabel(): string {
    const secs = Math.max(this.dispatchCountdown, 0);
    const mm = Math.floor(secs / 60).toString().padStart(2, '0');
    const ss = (secs % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }

  // Length of the visible blue arc (shrinks as time runs out)
  get dispatchRingOffset(): number {
    const remaining = Math.max(this.dispatchCountdown, 0) / this.DISPATCH_COUNTDOWN_SECONDS;
    return this.dispatchRingCircumference * (1 - remaining);
  }

  // Position of the dot at the end of the blue arc
  get dispatchRingDot(): { x: number; y: number } {
    const remaining = Math.max(this.dispatchCountdown, 0) / this.DISPATCH_COUNTDOWN_SECONDS;
    const angle = (-90 - 360 * remaining) * (Math.PI / 180); // arc runs counter-clockwise from 12 o'clock
    return {
      x: 80 + this.dispatchRingRadius * Math.cos(angle),
      y: 80 + this.dispatchRingRadius * Math.sin(angle),
    };
  }

  openDispatchCountdown() {
    this.clearDispatchTimer();
    this.dispatchCountdown = this.DISPATCH_COUNTDOWN_SECONDS;
    this.showDispatchModal = true;

    this.dispatchTimer = setInterval(() => {
      this.dispatchCountdown--;
      if (this.dispatchCountdown <= 0) {
        this.dispatchNow();
      }
    }, 1000);
  }

  // "Back to Edit" — stop the countdown and return to the form
  cancelDispatchCountdown() {
    this.clearDispatchTimer();
    this.showDispatchModal = false;
  }

  // "Sent to Dispatch" button, or countdown reached 0
  dispatchNow() {
    if (!this.showDispatchModal) {
      return; // already dispatched / cancelled — avoid double submit
    }
    this.clearDispatchTimer();
    this.showDispatchModal = false;
    this.onComplete();
  }

  private clearDispatchTimer() {
    if (this.dispatchTimer) {
      clearInterval(this.dispatchTimer);
      this.dispatchTimer = null;
    }
  }

  ngOnDestroy() {
    this.clearDispatchTimer();
  }

  clearForm() {
    this.ngOnInit();
  }

  onCancelClick() {
    this.selectCategoryId = ''; // Clear the dropdown selection
    this.closeAddNewItemPopUp(); // Close the popup
  }

  navigateToProdurement() {
    this.router.navigate(['/procurement']);
  }

  get categoryDropdownItems() {
    return this.categories.map(cat => ({
      value: cat.id.toString(),
      label: cat.typeName,
      disabled: false
    }));
  }

  // 5. Add selection change handler
  onCategorySelectionChange(selectedValue: string) {
    this.selectCategoryId = selectedValue || '';
    // Add any additional logic you need when category changes
  }




}

class OrderDetails {
  invNo!: string;
  displayName!: string;
  processOrderId!: number;
  orderId!: number;
  packageId!: number;
  orderpkgId!: number;
  productPrice!: number;
  definePackageId!: number;
  definePkgPrice: number = 0.00;
  items!: OrderItem[];
  packageQty: number = 1;

}

class OrderItem {
  itemId!: number;
  productTypeId!: number;
  productTypeShortCode!: string;
  productId!: number;
  productName!: string;
  qty!: number;
  price!: number;
  isExcluded: boolean = false;
  isEnabled!: number;
}

class ExcludeItems {
  id!: number;
  displayName!: string;
}

class PreferedItems {
  id!: number;
  displayName!: string;
}

class Categories {
  id!: number;
  typeName!: string;
  shortCode!: string;
}

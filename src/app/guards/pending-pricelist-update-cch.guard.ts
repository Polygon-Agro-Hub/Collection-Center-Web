import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { CchCenterPriceListComponent } from '../application/Price-List/cch-center-price-list/cch-center-price-list.component';

@Injectable({
  providedIn: 'root'
})
export class pendingPricelistUpdateCchGuard implements CanDeactivate<CchCenterPriceListComponent> {
     
  canDeactivate(component: CchCenterPriceListComponent): boolean | Observable<boolean> {
    // Check if there are unsaved changes (editing is in progress)
    if (component.hasUnsavedChanges()) {
      // Set the isExit flag to true to show the popup
      component.isExit = true;
      
      // Return false to prevent immediate navigation
      return false;
    }
    // Return true to allow navigation
    return true;
  }
}
    
    

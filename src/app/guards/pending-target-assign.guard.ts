import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AssignDistributionTargetComponent } from '../application/Distributed-Center/Distributed-Target/assign-distribution-target/assign-distribution-target.component';

@Injectable({
  providedIn: 'root'
})
export class PendingTargetAssignGuard implements CanDeactivate<AssignDistributionTargetComponent> {
     
  canDeactivate(component: AssignDistributionTargetComponent): boolean | Observable<boolean> {
    console.log('logged');
    
    component.checkIfDataChanged();
    // if (component.hasDataChanged) {
    //     component.isLeaveWithOutSaving = true;
    // }
    if (component.hasDataChanged && component.isLeaveWithOutSaving) {
      component.isExitAssignTarget = true;
      console.log('isExitAssignTarget', component.isExitAssignTarget)
      return false;
    }
    return true;
  }
}

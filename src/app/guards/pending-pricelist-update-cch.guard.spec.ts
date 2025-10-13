import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { pendingPricelistUpdateCchGuard } from './pending-pricelist-update-cch.guard';

describe('pendingPricelistUpdateCchGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => pendingPricelistUpdateCchGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

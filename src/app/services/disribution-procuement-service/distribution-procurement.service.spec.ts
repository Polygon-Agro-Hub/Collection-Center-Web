import { TestBed } from '@angular/core/testing';

import { DistributionProcurementService } from './distribution-procurement.service';

describe('DistributionProcurementService', () => {
  let service: DistributionProcurementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistributionProcurementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

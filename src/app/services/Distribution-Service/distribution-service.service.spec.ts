import { TestBed } from '@angular/core/testing';

import { DistributionServiceService } from './distribution-service.service';

describe('DistributionServiceService', () => {
  let service: DistributionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistributionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

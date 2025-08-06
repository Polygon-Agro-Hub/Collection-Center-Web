import { TestBed } from '@angular/core/testing';

import { DistributionComplaintsService } from './distribution-complaints.service';

describe('DistributionComplaintsService', () => {
  let service: DistributionComplaintsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistributionComplaintsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

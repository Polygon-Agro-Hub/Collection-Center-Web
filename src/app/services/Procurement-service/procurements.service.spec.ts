import { TestBed } from '@angular/core/testing';

import { ProcurementsService } from './procurements.service';

describe('ProcurementsService', () => {
  let service: ProcurementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcurementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { DistributedManageOfficersService } from './distributed-manage-officers.service';

describe('DistributedManageOfficersService', () => {
  let service: DistributedManageOfficersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistributedManageOfficersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ManageOfficersService } from './manage-officers.service';

describe('ManageOfficersService', () => {
  let service: ManageOfficersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageOfficersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

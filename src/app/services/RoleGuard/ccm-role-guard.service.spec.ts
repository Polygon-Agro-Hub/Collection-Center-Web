import { TestBed } from '@angular/core/testing';

import { CcmRoleGuardService } from './ccm-role-guard.service';

describe('CcmRoleGuardService', () => {
  let service: CcmRoleGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CcmRoleGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

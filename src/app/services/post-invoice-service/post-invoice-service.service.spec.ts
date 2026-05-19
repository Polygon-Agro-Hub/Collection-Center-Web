import { TestBed } from '@angular/core/testing';

import { PostInvoiceServiceService } from './post-invoice-service.service';

describe('PostInvoiceServiceService', () => {
  let service: PostInvoiceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostInvoiceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

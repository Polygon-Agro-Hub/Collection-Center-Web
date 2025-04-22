import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerReportInvoiceComponent } from './farmer-report-invoice.component';

describe('FarmerReportInvoiceComponent', () => {
  let component: FarmerReportInvoiceComponent;
  let fixture: ComponentFixture<FarmerReportInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmerReportInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmerReportInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

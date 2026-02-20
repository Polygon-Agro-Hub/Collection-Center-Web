import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPickupCashRevenueComponent } from './view-pickup-cash-revenue.component';

describe('ViewPickupCashRevenueComponent', () => {
  let component: ViewPickupCashRevenueComponent;
  let fixture: ComponentFixture<ViewPickupCashRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPickupCashRevenueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPickupCashRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

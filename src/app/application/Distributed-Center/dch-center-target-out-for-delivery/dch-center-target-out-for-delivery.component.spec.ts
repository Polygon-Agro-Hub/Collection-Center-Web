import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DchCenterTargetOutForDeliveryComponent } from './dch-center-target-out-for-delivery.component';

describe('DchCenterTargetOutForDeliveryComponent', () => {
  let component: DchCenterTargetOutForDeliveryComponent;
  let fixture: ComponentFixture<DchCenterTargetOutForDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DchCenterTargetOutForDeliveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DchCenterTargetOutForDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

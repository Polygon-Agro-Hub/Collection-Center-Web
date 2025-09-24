import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetOutForDeliveryComponent } from './target-out-for-delivery.component';

describe('TargetOutForDeliveryComponent', () => {
  let component: TargetOutForDeliveryComponent;
  let fixture: ComponentFixture<TargetOutForDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetOutForDeliveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetOutForDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

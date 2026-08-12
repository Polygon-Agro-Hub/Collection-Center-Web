import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOutForDeiveryOrderDetailsComponent } from './view-out-for-deivery-order-details.component';

describe('ViewOutForDeiveryOrderDetailsComponent', () => {
  let component: ViewOutForDeiveryOrderDetailsComponent;
  let fixture: ComponentFixture<ViewOutForDeiveryOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOutForDeiveryOrderDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOutForDeiveryOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

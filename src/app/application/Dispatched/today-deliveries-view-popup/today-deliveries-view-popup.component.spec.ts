import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayDeliveriesViewPopupComponent } from './today-deliveries-view-popup.component';

describe('TodayDeliveriesViewPopupComponent', () => {
  let component: TodayDeliveriesViewPopupComponent;
  let fixture: ComponentFixture<TodayDeliveriesViewPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayDeliveriesViewPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayDeliveriesViewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

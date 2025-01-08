import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDailyTargetComponent } from './view-daily-target.component';

describe('ViewDailyTargetComponent', () => {
  let component: ViewDailyTargetComponent;
  let fixture: ComponentFixture<ViewDailyTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDailyTargetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDailyTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

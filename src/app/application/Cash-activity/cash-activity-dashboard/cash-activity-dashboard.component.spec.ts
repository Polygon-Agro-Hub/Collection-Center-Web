import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashActivityDashboardComponent } from './cash-activity-dashboard.component';

describe('CashActivityDashboardComponent', () => {
  let component: CashActivityDashboardComponent;
  let fixture: ComponentFixture<CashActivityDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashActivityDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashActivityDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

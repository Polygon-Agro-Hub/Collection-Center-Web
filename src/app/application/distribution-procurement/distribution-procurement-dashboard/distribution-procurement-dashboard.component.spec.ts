import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionProcurementDashboardComponent } from './distribution-procurement-dashboard.component';

describe('DistributionProcurementDashboardComponent', () => {
  let component: DistributionProcurementDashboardComponent;
  let fixture: ComponentFixture<DistributionProcurementDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistributionProcurementDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributionProcurementDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

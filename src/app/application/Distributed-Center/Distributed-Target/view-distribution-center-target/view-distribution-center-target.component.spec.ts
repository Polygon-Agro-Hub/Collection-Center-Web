import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDistributionCenterTargetComponent } from './view-distribution-center-target.component';

describe('ViewDistributionCenterTargetComponent', () => {
  let component: ViewDistributionCenterTargetComponent;
  let fixture: ComponentFixture<ViewDistributionCenterTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDistributionCenterTargetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDistributionCenterTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDistributionOfficerTargetComponent } from './view-distribution-officer-target.component';

describe('ViewDistributionOfficerTargetComponent', () => {
  let component: ViewDistributionOfficerTargetComponent;
  let fixture: ComponentFixture<ViewDistributionOfficerTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDistributionOfficerTargetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDistributionOfficerTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

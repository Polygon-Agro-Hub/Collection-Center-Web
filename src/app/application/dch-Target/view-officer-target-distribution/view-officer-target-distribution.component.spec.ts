import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOfficerTargetDistributionComponent } from './view-officer-target-distribution.component';

describe('ViewOfficerTargetDistributionComponent', () => {
  let component: ViewOfficerTargetDistributionComponent;
  let fixture: ComponentFixture<ViewOfficerTargetDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOfficerTargetDistributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOfficerTargetDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

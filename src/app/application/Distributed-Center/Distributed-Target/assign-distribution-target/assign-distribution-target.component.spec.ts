import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDistributionTargetComponent } from './assign-distribution-target.component';

describe('AssignDistributionTargetComponent', () => {
  let component: AssignDistributionTargetComponent;
  let fixture: ComponentFixture<AssignDistributionTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignDistributionTargetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignDistributionTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

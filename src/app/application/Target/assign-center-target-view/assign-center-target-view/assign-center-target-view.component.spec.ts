import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCenterTargetViewComponent } from './assign-center-target-view.component';

describe('AssignCenterTargetViewComponent', () => {
  let component: AssignCenterTargetViewComponent;
  let fixture: ComponentFixture<AssignCenterTargetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignCenterTargetViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignCenterTargetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

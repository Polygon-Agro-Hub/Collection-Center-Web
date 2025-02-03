import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignOfficerTargetComponent } from './assign-officer-target.component';

describe('AssignOfficerTargetComponent', () => {
  let component: AssignOfficerTargetComponent;
  let fixture: ComponentFixture<AssignOfficerTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignOfficerTargetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignOfficerTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

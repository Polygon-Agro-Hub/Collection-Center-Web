import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssignOfficerTargetComponent } from './edit-assign-officer-target.component';

describe('EditAssignOfficerTargetComponent', () => {
  let component: EditAssignOfficerTargetComponent;
  let fixture: ComponentFixture<EditAssignOfficerTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAssignOfficerTargetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAssignOfficerTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

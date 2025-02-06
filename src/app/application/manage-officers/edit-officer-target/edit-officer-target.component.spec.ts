import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOfficerTargetComponent } from './edit-officer-target.component';

describe('EditOfficerTargetComponent', () => {
  let component: EditOfficerTargetComponent;
  let fixture: ComponentFixture<EditOfficerTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOfficerTargetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOfficerTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

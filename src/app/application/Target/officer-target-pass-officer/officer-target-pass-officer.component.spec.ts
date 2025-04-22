import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerTargetPassOfficerComponent } from './officer-target-pass-officer.component';

describe('OfficerTargetPassOfficerComponent', () => {
  let component: OfficerTargetPassOfficerComponent;
  let fixture: ComponentFixture<OfficerTargetPassOfficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerTargetPassOfficerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficerTargetPassOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveOfficerTargetComponent } from './move-officer-target.component';

describe('MoveOfficerTargetComponent', () => {
  let component: MoveOfficerTargetComponent;
  let fixture: ComponentFixture<MoveOfficerTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveOfficerTargetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveOfficerTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

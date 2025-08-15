import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerTargetsComponent } from './officer-targets.component';

describe('OfficerTargetsComponent', () => {
  let component: OfficerTargetsComponent;
  let fixture: ComponentFixture<OfficerTargetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerTargetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficerTargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerProfileComponent } from './officer-profile.component';

describe('OfficerProfileComponent', () => {
  let component: OfficerProfileComponent;
  let fixture: ComponentFixture<OfficerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

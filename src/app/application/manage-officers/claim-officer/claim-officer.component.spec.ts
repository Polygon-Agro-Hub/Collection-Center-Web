import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimOfficerComponent } from './claim-officer.component';

describe('ClaimOfficerComponent', () => {
  let component: ClaimOfficerComponent;
  let fixture: ComponentFixture<ClaimOfficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimOfficerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

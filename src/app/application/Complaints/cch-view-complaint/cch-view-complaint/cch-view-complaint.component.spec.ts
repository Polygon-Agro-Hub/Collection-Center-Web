import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CchViewComplaintComponent } from './cch-view-complaint.component';

describe('CchViewComplaintComponent', () => {
  let component: CchViewComplaintComponent;
  let fixture: ComponentFixture<CchViewComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CchViewComplaintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CchViewComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

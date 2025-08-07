import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcmSentComplaintsComponent } from './dcm-sent-complaints.component';

describe('DcmSentComplaintsComponent', () => {
  let component: DcmSentComplaintsComponent;
  let fixture: ComponentFixture<DcmSentComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DcmSentComplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DcmSentComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

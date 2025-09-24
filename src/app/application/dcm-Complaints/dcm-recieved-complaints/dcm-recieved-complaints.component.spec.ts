import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcmRecievedComplaintsComponent } from './dcm-recieved-complaints.component';

describe('DcmRecievedComplaintsComponent', () => {
  let component: DcmRecievedComplaintsComponent;
  let fixture: ComponentFixture<DcmRecievedComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DcmRecievedComplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DcmRecievedComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

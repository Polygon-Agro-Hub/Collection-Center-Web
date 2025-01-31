import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CchSendComplaintComponent } from './cch-send-complaint.component';

describe('CchSendComplaintComponent', () => {
  let component: CchSendComplaintComponent;
  let fixture: ComponentFixture<CchSendComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CchSendComplaintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CchSendComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

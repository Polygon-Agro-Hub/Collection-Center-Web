import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendedComplaintComponent } from './sended-complaint.component';

describe('SendedComplaintComponent', () => {
  let component: SendedComplaintComponent;
  let fixture: ComponentFixture<SendedComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendedComplaintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendedComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DchViewRecieveComplaintComponent } from './dch-view-recieve-complaint.component';

describe('DchViewRecieveComplaintComponent', () => {
  let component: DchViewRecieveComplaintComponent;
  let fixture: ComponentFixture<DchViewRecieveComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DchViewRecieveComplaintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DchViewRecieveComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

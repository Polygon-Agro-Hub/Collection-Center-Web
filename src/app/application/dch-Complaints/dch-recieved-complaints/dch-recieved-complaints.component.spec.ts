import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DchRecievedComplaintsComponent } from './dch-recieved-complaints.component';

describe('DchRecievedComplaintsComponent', () => {
  let component: DchRecievedComplaintsComponent;
  let fixture: ComponentFixture<DchRecievedComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DchRecievedComplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DchRecievedComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

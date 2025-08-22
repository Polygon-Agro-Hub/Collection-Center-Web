import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DchSentComplaintsComponent } from './dch-sent-complaints.component';

describe('DchSentComplaintsComponent', () => {
  let component: DchSentComplaintsComponent;
  let fixture: ComponentFixture<DchSentComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DchSentComplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DchSentComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

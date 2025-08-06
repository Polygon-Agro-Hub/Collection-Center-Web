import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcmComplaintsComponent } from './dcm-complaints.component';

describe('DcmComplaintsComponent', () => {
  let component: DcmComplaintsComponent;
  let fixture: ComponentFixture<DcmComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DcmComplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DcmComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

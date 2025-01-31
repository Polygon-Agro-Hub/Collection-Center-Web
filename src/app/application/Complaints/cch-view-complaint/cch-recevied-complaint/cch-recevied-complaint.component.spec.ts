import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CchReceviedComplaintComponent } from './cch-recevied-complaint.component';

describe('CchReceviedComplaintComponent', () => {
  let component: CchReceviedComplaintComponent;
  let fixture: ComponentFixture<CchReceviedComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CchReceviedComplaintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CchReceviedComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

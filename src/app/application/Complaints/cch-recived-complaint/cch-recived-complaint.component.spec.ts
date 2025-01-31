import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CchRecivedComplaintComponent } from './cch-recived-complaint.component';

describe('CchRecivedComplaintComponent', () => {
  let component: CchRecivedComplaintComponent;
  let fixture: ComponentFixture<CchRecivedComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CchRecivedComplaintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CchRecivedComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

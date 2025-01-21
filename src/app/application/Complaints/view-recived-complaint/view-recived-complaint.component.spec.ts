import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRecivedComplaintComponent } from './view-recived-complaint.component';

describe('ViewRecivedComplaintComponent', () => {
  let component: ViewRecivedComplaintComponent;
  let fixture: ComponentFixture<ViewRecivedComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRecivedComplaintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRecivedComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcmDashboardComponent } from './dcm-dashboard.component';

describe('DcmDashboardComponent', () => {
  let component: DcmDashboardComponent;
  let fixture: ComponentFixture<DcmDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DcmDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DcmDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

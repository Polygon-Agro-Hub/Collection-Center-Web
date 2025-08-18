import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DchCenterDashboardComponent } from './dch-center-dashboard.component';

describe('DchCenterDashboardComponent', () => {
  let component: DchCenterDashboardComponent;
  let fixture: ComponentFixture<DchCenterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DchCenterDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DchCenterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

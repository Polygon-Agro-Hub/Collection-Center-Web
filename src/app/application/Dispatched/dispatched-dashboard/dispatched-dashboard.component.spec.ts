import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchedDashboardComponent } from './dispatched-dashboard.component';

describe('DispatchedDashboardComponent', () => {
  let component: DispatchedDashboardComponent;
  let fixture: ComponentFixture<DispatchedDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchedDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchedDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCenterTargetComponent } from './view-center-target.component';

describe('ViewCenterTargetComponent', () => {
  let component: ViewCenterTargetComponent;
  let fixture: ComponentFixture<ViewCenterTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCenterTargetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCenterTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

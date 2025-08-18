import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDchCenterTargetComponent } from './view-dch-center-target.component';

describe('ViewDchCenterTargetComponent', () => {
  let component: ViewDchCenterTargetComponent;
  let fixture: ComponentFixture<ViewDchCenterTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDchCenterTargetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDchCenterTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

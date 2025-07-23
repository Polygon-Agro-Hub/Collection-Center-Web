import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCentresComponent } from './view-centres.component';

describe('ViewCentresComponent', () => {
  let component: ViewCentresComponent;
  let fixture: ComponentFixture<ViewCentresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCentresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCentresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

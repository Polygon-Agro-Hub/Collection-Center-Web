import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCentersComponent } from './view-centers.component';

describe('ViewCentersComponent', () => {
  let component: ViewCentersComponent;
  let fixture: ComponentFixture<ViewCentersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCentersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

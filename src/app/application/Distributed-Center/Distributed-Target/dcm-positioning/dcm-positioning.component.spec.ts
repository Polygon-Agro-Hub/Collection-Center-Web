import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcmPositioningComponent } from './dcm-positioning.component';

describe('DcmPositioningComponent', () => {
  let component: DcmPositioningComponent;
  let fixture: ComponentFixture<DcmPositioningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DcmPositioningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DcmPositioningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

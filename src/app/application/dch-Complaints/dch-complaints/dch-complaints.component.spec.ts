import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DchComplaintsComponent } from './dch-complaints.component';

describe('DchComplaintsComponent', () => {
  let component: DchComplaintsComponent;
  let fixture: ComponentFixture<DchComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DchComplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DchComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

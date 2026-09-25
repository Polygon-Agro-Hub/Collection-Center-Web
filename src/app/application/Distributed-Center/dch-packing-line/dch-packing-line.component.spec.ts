import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DchPackingLineComponent } from './dch-packing-line.component';

describe('DchPackingLineComponent', () => {
  let component: DchPackingLineComponent;
  let fixture: ComponentFixture<DchPackingLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DchPackingLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DchPackingLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

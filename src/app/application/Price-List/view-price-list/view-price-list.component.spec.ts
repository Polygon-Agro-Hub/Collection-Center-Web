import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPriceListComponent } from './view-price-list.component';

describe('ViewPriceListComponent', () => {
  let component: ViewPriceListComponent;
  let fixture: ComponentFixture<ViewPriceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPriceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

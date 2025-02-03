import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterViewPriceListComponent } from './center-view-price-list.component';

describe('CenterViewPriceListComponent', () => {
  let component: CenterViewPriceListComponent;
  let fixture: ComponentFixture<CenterViewPriceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterViewPriceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterViewPriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

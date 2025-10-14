import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CchCenterPriceListComponent } from './cch-center-price-list.component';

describe('CchCenterPriceListComponent', () => {
  let component: CchCenterPriceListComponent;
  let fixture: ComponentFixture<CchCenterPriceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CchCenterPriceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CchCenterPriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

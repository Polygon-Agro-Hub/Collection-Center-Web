import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductShortageTodayComponent } from './product-shortage-today.component';

describe('ProductShortageTodayComponent', () => {
  let component: ProductShortageTodayComponent;
  let fixture: ComponentFixture<ProductShortageTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductShortageTodayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductShortageTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

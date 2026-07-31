import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductShortageTodayCompletedComponent } from './product-shortage-today-completed.component';

describe('ProductShortageTodayCompletedComponent', () => {
  let component: ProductShortageTodayCompletedComponent;
  let fixture: ComponentFixture<ProductShortageTodayCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductShortageTodayCompletedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductShortageTodayCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

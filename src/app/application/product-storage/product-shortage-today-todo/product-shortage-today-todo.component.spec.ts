import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductShortageTodayTodoComponent } from './product-shortage-today-todo.component';

describe('ProductShortageTodayTodoComponent', () => {
  let component: ProductShortageTodayTodoComponent;
  let fixture: ComponentFixture<ProductShortageTodayTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductShortageTodayTodoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductShortageTodayTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

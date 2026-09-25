import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStorageHistoryComponent } from './product-storage-history.component';

describe('ProductStorageHistoryComponent', () => {
  let component: ProductStorageHistoryComponent;
  let fixture: ComponentFixture<ProductStorageHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductStorageHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductStorageHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

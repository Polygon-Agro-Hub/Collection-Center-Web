import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStorageDashboardComponent } from './product-storage-dashboard.component';

describe('ProductStorageDashboardComponent', () => {
  let component: ProductStorageDashboardComponent;
  let fixture: ComponentFixture<ProductStorageDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductStorageDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductStorageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

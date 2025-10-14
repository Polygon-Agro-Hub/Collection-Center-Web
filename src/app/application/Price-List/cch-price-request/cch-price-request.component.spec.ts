import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CchPriceRequestComponent } from './cch-price-request.component';

describe('CchPriceRequestComponent', () => {
  let component: CchPriceRequestComponent;
  let fixture: ComponentFixture<CchPriceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CchPriceRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CchPriceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

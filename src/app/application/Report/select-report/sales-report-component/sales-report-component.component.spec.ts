import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReportComponentComponent } from './sales-report-component.component';

describe('SalesReportComponentComponent', () => {
  let component: SalesReportComponentComponent;
  let fixture: ComponentFixture<SalesReportComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesReportComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesReportComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionMonthlyReportComponent } from './collection-monthly-report.component';

describe('CollectionMonthlyReportComponent', () => {
  let component: CollectionMonthlyReportComponent;
  let fixture: ComponentFixture<CollectionMonthlyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionMonthlyReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionMonthlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

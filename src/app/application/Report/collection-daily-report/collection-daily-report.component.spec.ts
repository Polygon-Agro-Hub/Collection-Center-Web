import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionDailyReportComponent } from './collection-daily-report.component';

describe('CollectionDailyReportComponent', () => {
  let component: CollectionDailyReportComponent;
  let fixture: ComponentFixture<CollectionDailyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionDailyReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionDailyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

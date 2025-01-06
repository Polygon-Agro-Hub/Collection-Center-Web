import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerReportComponent } from './farmer-report.component';

describe('FarmerReportComponent', () => {
  let component: FarmerReportComponent;
  let fixture: ComponentFixture<FarmerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmerReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

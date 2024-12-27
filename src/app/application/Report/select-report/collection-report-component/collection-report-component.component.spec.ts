import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionReportComponentComponent } from './collection-report-component.component';

describe('CollectionReportComponentComponent', () => {
  let component: CollectionReportComponentComponent;
  let fixture: ComponentFixture<CollectionReportComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionReportComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionReportComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

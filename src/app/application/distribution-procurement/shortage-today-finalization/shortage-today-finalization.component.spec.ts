import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortageTodayFinalizationComponent } from './shortage-today-finalization.component';

describe('ShortageTodayFinalizationComponent', () => {
  let component: ShortageTodayFinalizationComponent;
  let fixture: ComponentFixture<ShortageTodayFinalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortageTodayFinalizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortageTodayFinalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

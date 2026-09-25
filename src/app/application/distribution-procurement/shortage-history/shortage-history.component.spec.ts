import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortageHistoryComponent } from './shortage-history.component';

describe('ShortageHistoryComponent', () => {
  let component: ShortageHistoryComponent;
  let fixture: ComponentFixture<ShortageHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortageHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortageHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

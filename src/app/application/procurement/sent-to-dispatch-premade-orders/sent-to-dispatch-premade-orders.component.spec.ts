import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentToDispatchPremadeOrdersComponent } from './sent-to-dispatch-premade-orders.component';

describe('SentToDispatchPremadeOrdersComponent', () => {
  let component: SentToDispatchPremadeOrdersComponent;
  let fixture: ComponentFixture<SentToDispatchPremadeOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentToDispatchPremadeOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentToDispatchPremadeOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

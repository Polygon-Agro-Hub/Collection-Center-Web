import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedefineSentToDispatchOrdersComponent } from './redefine-sent-to-dispatch-orders.component';

describe('RedefineSentToDispatchOrdersComponent', () => {
  let component: RedefineSentToDispatchOrdersComponent;
  let fixture: ComponentFixture<RedefineSentToDispatchOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedefineSentToDispatchOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedefineSentToDispatchOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

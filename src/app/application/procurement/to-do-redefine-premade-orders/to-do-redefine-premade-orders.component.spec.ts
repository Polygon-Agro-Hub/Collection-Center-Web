import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoRedefinePremadeOrdersComponent } from './to-do-redefine-premade-orders.component';

describe('ToDoRedefinePremadeOrdersComponent', () => {
  let component: ToDoRedefinePremadeOrdersComponent;
  let fixture: ComponentFixture<ToDoRedefinePremadeOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoRedefinePremadeOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToDoRedefinePremadeOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

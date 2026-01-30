import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedefineTodoOrdersComponent } from './redefine-todo-orders.component';

describe('RedefineTodoOrdersComponent', () => {
  let component: RedefineTodoOrdersComponent;
  let fixture: ComponentFixture<RedefineTodoOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedefineTodoOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedefineTodoOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetProgressTodoComponent } from './target-progress-todo.component';

describe('TargetProgressTodoComponent', () => {
  let component: TargetProgressTodoComponent;
  let fixture: ComponentFixture<TargetProgressTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetProgressTodoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetProgressTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

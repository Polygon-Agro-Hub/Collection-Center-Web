import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMyTargetComponent } from './edit-my-target.component';

describe('EditMyTargetComponent', () => {
  let component: EditMyTargetComponent;
  let fixture: ComponentFixture<EditMyTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMyTargetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMyTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

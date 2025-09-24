import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetProgressCompletedComponent } from './target-progress-completed.component';

describe('TargetProgressCompletedComponent', () => {
  let component: TargetProgressCompletedComponent;
  let fixture: ComponentFixture<TargetProgressCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetProgressCompletedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetProgressCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

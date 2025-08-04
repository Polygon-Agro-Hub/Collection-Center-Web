import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetProgressAllComponent } from './target-progress-all.component';

describe('TargetProgressAllComponent', () => {
  let component: TargetProgressAllComponent;
  let fixture: ComponentFixture<TargetProgressAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetProgressAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetProgressAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetProgressOngoingComponent } from './target-progress-ongoing.component';

describe('TargetProgressOngoingComponent', () => {
  let component: TargetProgressOngoingComponent;
  let fixture: ComponentFixture<TargetProgressOngoingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetProgressOngoingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetProgressOngoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

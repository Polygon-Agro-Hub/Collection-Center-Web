import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyTargetComponent } from './view-my-target.component';

describe('ViewMyTargetComponent', () => {
  let component: ViewMyTargetComponent;
  let fixture: ComponentFixture<ViewMyTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMyTargetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMyTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyTargetDcmComponent } from './view-my-target-dcm.component';

describe('ViewMyTargetDcmComponent', () => {
  let component: ViewMyTargetDcmComponent;
  let fixture: ComponentFixture<ViewMyTargetDcmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMyTargetDcmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMyTargetDcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

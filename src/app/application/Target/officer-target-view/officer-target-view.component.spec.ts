import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerTargetViewComponent } from './officer-target-view.component';

describe('OfficerTargetViewComponent', () => {
  let component: OfficerTargetViewComponent;
  let fixture: ComponentFixture<OfficerTargetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerTargetViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficerTargetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

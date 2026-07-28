import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingTargetsComponent } from './packing-targets.component';

describe('PackingTargetsComponent', () => {
  let component: PackingTargetsComponent;
  let fixture: ComponentFixture<PackingTargetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackingTargetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackingTargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

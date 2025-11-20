import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDistributionCenterComponent } from './edit-distribution-center.component';

describe('EditDistributionCenterComponent', () => {
  let component: EditDistributionCenterComponent;
  let fixture: ComponentFixture<EditDistributionCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDistributionCenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDistributionCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

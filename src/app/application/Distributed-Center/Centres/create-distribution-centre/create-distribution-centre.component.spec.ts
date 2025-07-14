import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDistributionCentreComponent } from './create-distribution-centre.component';

describe('CreateDistributionCentreComponent', () => {
  let component: CreateDistributionCentreComponent;
  let fixture: ComponentFixture<CreateDistributionCentreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDistributionCentreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDistributionCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

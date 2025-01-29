import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentersDashbordComponent } from './centers-dashbord.component';

describe('CentersDashbordComponent', () => {
  let component: CentersDashbordComponent;
  let fixture: ComponentFixture<CentersDashbordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentersDashbordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentersDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

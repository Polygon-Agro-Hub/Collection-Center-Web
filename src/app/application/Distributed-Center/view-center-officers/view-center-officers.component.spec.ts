import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCenterOfficersComponent } from './view-center-officers.component';

describe('ViewCenterOfficersComponent', () => {
  let component: ViewCenterOfficersComponent;
  let fixture: ComponentFixture<ViewCenterOfficersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCenterOfficersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCenterOfficersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

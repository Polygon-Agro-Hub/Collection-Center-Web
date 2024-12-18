import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOfficersComponent } from './view-officers.component';

describe('ViewOfficersComponent', () => {
  let component: ViewOfficersComponent;
  let fixture: ComponentFixture<ViewOfficersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOfficersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOfficersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOfficersComponent } from './add-officers.component';

describe('AddOfficersComponent', () => {
  let component: AddOfficersComponent;
  let fixture: ComponentFixture<AddOfficersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOfficersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOfficersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

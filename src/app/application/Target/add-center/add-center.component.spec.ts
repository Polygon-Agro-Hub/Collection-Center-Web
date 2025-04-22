import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCenterComponent } from './add-center.component';

describe('AddCenterComponent', () => {
  let component: AddCenterComponent;
  let fixture: ComponentFixture<AddCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

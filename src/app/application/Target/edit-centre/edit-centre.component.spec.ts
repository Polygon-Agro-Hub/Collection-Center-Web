import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCentreComponent } from './edit-centre.component';

describe('EditCentreComponent', () => {
  let component: EditCentreComponent;
  let fixture: ComponentFixture<EditCentreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCentreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerchableDropdownComponent } from './serchable-dropdown.component';

describe('SerchableDropdownComponent', () => {
  let component: SerchableDropdownComponent;
  let fixture: ComponentFixture<SerchableDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerchableDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerchableDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

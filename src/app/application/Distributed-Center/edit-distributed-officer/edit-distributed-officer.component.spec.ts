import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDistributedOfficerComponent } from './edit-distributed-officer.component';

describe('EditDistributedOfficerComponent', () => {
  let component: EditDistributedOfficerComponent;
  let fixture: ComponentFixture<EditDistributedOfficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDistributedOfficerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDistributedOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

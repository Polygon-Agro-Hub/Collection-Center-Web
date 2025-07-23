import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDistributedOfficerComponent } from './add-distributed-officer.component';

describe('AddDistributedOfficerComponent', () => {
  let component: AddDistributedOfficerComponent;
  let fixture: ComponentFixture<AddDistributedOfficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDistributedOfficerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDistributedOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

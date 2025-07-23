import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDistributedOfficersComponent } from './view-distributed-officers.component';

describe('ViewDistributedOfficersComponent', () => {
  let component: ViewDistributedOfficersComponent;
  let fixture: ComponentFixture<ViewDistributedOfficersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDistributedOfficersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDistributedOfficersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

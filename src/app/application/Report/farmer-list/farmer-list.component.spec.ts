import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerListComponent } from './farmer-list.component';

describe('FarmerListComponent', () => {
  let component: FarmerListComponent;
  let fixture: ComponentFixture<FarmerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

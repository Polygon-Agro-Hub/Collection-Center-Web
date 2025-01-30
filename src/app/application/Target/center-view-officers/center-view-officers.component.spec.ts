import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterViewOfficersComponent } from './center-view-officers.component';

describe('CenterViewOfficersComponent', () => {
  let component: CenterViewOfficersComponent;
  let fixture: ComponentFixture<CenterViewOfficersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterViewOfficersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterViewOfficersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

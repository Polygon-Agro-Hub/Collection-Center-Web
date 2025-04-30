import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorizedAccessPageComponent } from './unauthorized-access-page.component';

describe('UnauthorizedAccessPageComponent', () => {
  let component: UnauthorizedAccessPageComponent;
  let fixture: ComponentFixture<UnauthorizedAccessPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthorizedAccessPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnauthorizedAccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

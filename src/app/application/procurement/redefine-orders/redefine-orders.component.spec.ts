import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedefineOrdersComponent } from './redefine-orders.component';

describe('RedefineOrdersComponent', () => {
  let component: RedefineOrdersComponent;
  let fixture: ComponentFixture<RedefineOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedefineOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedefineOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

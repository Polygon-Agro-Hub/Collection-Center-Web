import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedItemsComponent } from './requested-items.component';

describe('RequestedItemsComponent', () => {
  let component: RequestedItemsComponent;
  let fixture: ComponentFixture<RequestedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestedItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

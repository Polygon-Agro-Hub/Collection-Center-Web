import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDcmReceiveReplyComponent } from './view-dcm-receive-reply.component';

describe('ViewDcmReceiveReplyComponent', () => {
  let component: ViewDcmReceiveReplyComponent;
  let fixture: ComponentFixture<ViewDcmReceiveReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDcmReceiveReplyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDcmReceiveReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

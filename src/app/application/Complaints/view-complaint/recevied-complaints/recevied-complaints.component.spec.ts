import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceviedComplaintsComponent } from './recevied-complaints.component';

describe('ReceviedComplaintsComponent', () => {
  let component: ReceviedComplaintsComponent;
  let fixture: ComponentFixture<ReceviedComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceviedComplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceviedComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

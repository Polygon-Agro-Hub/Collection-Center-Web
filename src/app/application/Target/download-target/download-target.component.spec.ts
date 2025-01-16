import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadTargetComponent } from './download-target.component';

describe('DownloadTargetComponent', () => {
  let component: DownloadTargetComponent;
  let fixture: ComponentFixture<DownloadTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadTargetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

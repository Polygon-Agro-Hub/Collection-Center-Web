import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterCollectionExpenseComponent } from './center-collection-expense.component';

describe('CenterCollectionExpenseComponent', () => {
  let component: CenterCollectionExpenseComponent;
  let fixture: ComponentFixture<CenterCollectionExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterCollectionExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterCollectionExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

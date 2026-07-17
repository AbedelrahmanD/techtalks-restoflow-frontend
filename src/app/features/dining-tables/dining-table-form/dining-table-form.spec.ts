import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiningTableForm } from './dining-table-form';

describe('DiningTableForm', () => {
  let component: DiningTableForm;
  let fixture: ComponentFixture<DiningTableForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiningTableForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DiningTableForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

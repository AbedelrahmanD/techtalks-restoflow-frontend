import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiningTablesList } from './dining-tables-list';

describe('DiningTablesList', () => {
  let component: DiningTablesList;
  let fixture: ComponentFixture<DiningTablesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiningTablesList],
    }).compileComponents();

    fixture = TestBed.createComponent(DiningTablesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

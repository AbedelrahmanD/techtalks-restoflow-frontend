import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiningTableQr } from './dining-table-qr';

describe('DiningTableQr', () => {
  let component: DiningTableQr;
  let fixture: ComponentFixture<DiningTableQr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiningTableQr],
    }).compileComponents();

    fixture = TestBed.createComponent(DiningTableQr);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

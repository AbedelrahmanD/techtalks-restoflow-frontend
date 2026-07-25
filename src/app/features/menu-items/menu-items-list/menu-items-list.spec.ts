import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemsList } from './menu-items-list';

describe('MenuItemsList', () => {
  let component: MenuItemsList;
  let fixture: ComponentFixture<MenuItemsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemsList],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuItemsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

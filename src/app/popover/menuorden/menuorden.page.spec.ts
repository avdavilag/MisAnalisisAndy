import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuordenPage } from './menuorden.page';

describe('MenuordenPage', () => {
  let component: MenuordenPage;
  let fixture: ComponentFixture<MenuordenPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MenuordenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

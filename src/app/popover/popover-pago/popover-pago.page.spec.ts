import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopoverPagoPage } from './popover-pago.page';

describe('PopoverPagoPage', () => {
  let component: PopoverPagoPage;
  let fixture: ComponentFixture<PopoverPagoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PopoverPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

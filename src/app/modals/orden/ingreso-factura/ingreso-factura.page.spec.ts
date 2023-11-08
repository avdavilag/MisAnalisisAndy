import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngresoFacturaPage } from './ingreso-factura.page';

describe('IngresoFacturaPage', () => {
  let component: IngresoFacturaPage;
  let fixture: ComponentFixture<IngresoFacturaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IngresoFacturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

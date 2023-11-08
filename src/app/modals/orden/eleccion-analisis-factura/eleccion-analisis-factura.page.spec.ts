import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EleccionAnalisisFacturaPage } from './eleccion-analisis-factura.page';

describe('EleccionAnalisisFacturaPage', () => {
  let component: EleccionAnalisisFacturaPage;
  let fixture: ComponentFixture<EleccionAnalisisFacturaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EleccionAnalisisFacturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

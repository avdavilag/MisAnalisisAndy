import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusquedaPacientesPage } from './busqueda-pacientes.page';

describe('BusquedaPacientesPage', () => {
  let component: BusquedaPacientesPage;
  let fixture: ComponentFixture<BusquedaPacientesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BusquedaPacientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

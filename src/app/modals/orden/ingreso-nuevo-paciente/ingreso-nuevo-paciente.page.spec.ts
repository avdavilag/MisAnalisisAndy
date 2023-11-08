import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngresoNuevoPacientePage } from './ingreso-nuevo-paciente.page';

describe('IngresoNuevoPacientePage', () => {
  let component: IngresoNuevoPacientePage;
  let fixture: ComponentFixture<IngresoNuevoPacientePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IngresoNuevoPacientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

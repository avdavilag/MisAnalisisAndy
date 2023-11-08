import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngresoNuevoMedicoPage } from './ingreso-nuevo-medico.page';

describe('IngresoNuevoMedicoPage', () => {
  let component: IngresoNuevoMedicoPage;
  let fixture: ComponentFixture<IngresoNuevoMedicoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IngresoNuevoMedicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

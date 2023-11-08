import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngresoOrdenCompletaPage } from './ingreso-orden-completa.page';

describe('IngresoOrdenCompletaPage', () => {
  let component: IngresoOrdenCompletaPage;
  let fixture: ComponentFixture<IngresoOrdenCompletaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IngresoOrdenCompletaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

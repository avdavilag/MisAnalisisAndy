import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvcalidadPage } from './evcalidad.page';

describe('EvcalidadPage', () => {
  let component: EvcalidadPage;
  let fixture: ComponentFixture<EvcalidadPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EvcalidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

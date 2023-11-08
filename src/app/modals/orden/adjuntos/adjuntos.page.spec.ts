import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdjuntosPage } from './adjuntos.page';

describe('AdjuntosPage', () => {
  let component: AdjuntosPage;
  let fixture: ComponentFixture<AdjuntosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdjuntosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

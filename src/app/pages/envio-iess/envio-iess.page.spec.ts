import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvioIessPage } from './envio-iess.page';

describe('EnvioIessPage', () => {
  let component: EnvioIessPage;
  let fixture: ComponentFixture<EnvioIessPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EnvioIessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

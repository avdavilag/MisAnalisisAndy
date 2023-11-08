import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MuestrasPage } from './muestras.page';

describe('MuestrasPage', () => {
  let component: MuestrasPage;
  let fixture: ComponentFixture<MuestrasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MuestrasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

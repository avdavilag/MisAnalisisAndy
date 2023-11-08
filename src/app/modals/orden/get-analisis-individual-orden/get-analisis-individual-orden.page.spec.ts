import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GetAnalisisIndividualOrdenPage } from './get-analisis-individual-orden.page';

describe('GetAnalisisIndividualOrdenPage', () => {
  let component: GetAnalisisIndividualOrdenPage;
  let fixture: ComponentFixture<GetAnalisisIndividualOrdenPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GetAnalisisIndividualOrdenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchPacientePage } from './search-paciente.page';

describe('SearchPacientePage', () => {
  let component: SearchPacientePage;
  let fixture: ComponentFixture<SearchPacientePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SearchPacientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchMedicoPage } from './search-medico.page';

describe('SearchMedicoPage', () => {
  let component: SearchMedicoPage;
  let fixture: ComponentFixture<SearchMedicoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SearchMedicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

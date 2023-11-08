import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlertPeriodoFiltroPage } from './alert-periodo-filtro.page';

describe('AlertPeriodoFiltroPage', () => {
  let component: AlertPeriodoFiltroPage;
  let fixture: ComponentFixture<AlertPeriodoFiltroPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertPeriodoFiltroPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertPeriodoFiltroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

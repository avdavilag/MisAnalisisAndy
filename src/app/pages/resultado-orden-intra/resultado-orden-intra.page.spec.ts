import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResultadoOrdenIntraPage } from './resultado-orden-intra.page';

describe('ResultadoOrdenIntraPage', () => {
  let component: ResultadoOrdenIntraPage;
  let fixture: ComponentFixture<ResultadoOrdenIntraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadoOrdenIntraPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultadoOrdenIntraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

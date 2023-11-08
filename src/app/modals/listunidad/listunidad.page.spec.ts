import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListunidadPage } from './listunidad.page';

describe('ListunidadPage', () => {
  let component: ListunidadPage;
  let fixture: ComponentFixture<ListunidadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListunidadPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListunidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

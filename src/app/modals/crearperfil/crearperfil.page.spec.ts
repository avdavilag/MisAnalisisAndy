import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CrearperfilPage } from './crearperfil.page';

describe('CrearperfilPage', () => {
  let component: CrearperfilPage;
  let fixture: ComponentFixture<CrearperfilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearperfilPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CrearperfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

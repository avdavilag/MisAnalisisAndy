import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePacientePage } from './home-paciente.page';

describe('HomePacientePage', () => {
  let component: HomePacientePage;
  let fixture: ComponentFixture<HomePacientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePacientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePacientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

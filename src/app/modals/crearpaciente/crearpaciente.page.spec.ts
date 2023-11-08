import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CrearpacientePage } from './crearpaciente.page';

describe('CrearpacientePage', () => {
  let component: CrearpacientePage;
  let fixture: ComponentFixture<CrearpacientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearpacientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CrearpacientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

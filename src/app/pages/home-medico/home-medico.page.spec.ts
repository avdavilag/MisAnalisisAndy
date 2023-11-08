import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeMedicoPage } from './home-medico.page';

describe('HomeMedicoPage', () => {
  let component: HomeMedicoPage;
  let fixture: ComponentFixture<HomeMedicoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeMedicoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeMedicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

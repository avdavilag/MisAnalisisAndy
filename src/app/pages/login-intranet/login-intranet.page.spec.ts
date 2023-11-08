import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginIntranetPage } from './login-intranet.page';

describe('LoginIntranetPage', () => {
  let component: LoginIntranetPage;
  let fixture: ComponentFixture<LoginIntranetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginIntranetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginIntranetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

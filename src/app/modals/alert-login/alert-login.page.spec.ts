import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlertLoginPage } from './alert-login.page';

describe('AlertLoginPage', () => {
  let component: AlertLoginPage;
  let fixture: ComponentFixture<AlertLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertLoginPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

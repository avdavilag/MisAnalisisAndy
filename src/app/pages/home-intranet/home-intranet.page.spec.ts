import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeIntranetPage } from './home-intranet.page';

describe('HomeIntranetPage', () => {
  let component: HomeIntranetPage;
  let fixture: ComponentFixture<HomeIntranetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeIntranetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeIntranetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

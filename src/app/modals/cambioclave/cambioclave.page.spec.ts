import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CambioclavePage } from './cambioclave.page';

describe('CambioclavePage', () => {
  let component: CambioclavePage;
  let fixture: ComponentFixture<CambioclavePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioclavePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CambioclavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

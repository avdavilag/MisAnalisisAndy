import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VisorQrPage } from './visor-qr.page';

describe('VisorQrPage', () => {
  let component: VisorQrPage;
  let fixture: ComponentFixture<VisorQrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisorQrPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VisorQrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

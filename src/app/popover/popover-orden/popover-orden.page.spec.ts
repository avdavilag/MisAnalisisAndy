import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverOrdenPage } from './popover-orden.page';

describe('PopoverOrdenPage', () => {
  let component: PopoverOrdenPage;
  let fixture: ComponentFixture<PopoverOrdenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverOrdenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverOrdenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverUsrPage } from './popover-usr.page';

describe('PopoverUsrPage', () => {
  let component: PopoverUsrPage;
  let fixture: ComponentFixture<PopoverUsrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverUsrPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverUsrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

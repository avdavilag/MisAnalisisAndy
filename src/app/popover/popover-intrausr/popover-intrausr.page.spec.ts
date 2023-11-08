import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverIntrausrPage } from './popover-intrausr.page';

describe('PopoverIntrausrPage', () => {
  let component: PopoverIntrausrPage;
  let fixture: ComponentFixture<PopoverIntrausrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverIntrausrPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverIntrausrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

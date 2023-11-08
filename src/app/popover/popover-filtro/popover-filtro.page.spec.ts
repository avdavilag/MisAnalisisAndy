import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverFiltroPage } from './popover-filtro.page';

describe('PopoverFiltroPage', () => {
  let component: PopoverFiltroPage;
  let fixture: ComponentFixture<PopoverFiltroPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverFiltroPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverFiltroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

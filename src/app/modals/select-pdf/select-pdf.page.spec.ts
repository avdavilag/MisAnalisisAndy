import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectPdfPage } from './select-pdf.page';

describe('SelectPdfPage', () => {
  let component: SelectPdfPage;
  let fixture: ComponentFixture<SelectPdfPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPdfPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPdfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

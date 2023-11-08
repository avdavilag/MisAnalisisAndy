import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChartsPacientePage } from './charts-paciente.page';

describe('ChartsPacientePage', () => {
  let component: ChartsPacientePage;
  let fixture: ComponentFixture<ChartsPacientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartsPacientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChartsPacientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

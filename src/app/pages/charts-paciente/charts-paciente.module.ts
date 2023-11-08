import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChartsPacientePageRoutingModule } from './charts-paciente-routing.module';

import { ChartsPacientePage } from './charts-paciente.page';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartsPacientePageRoutingModule,
    NgxChartsModule,
    SharedDirectivesModule,
    
  ],
  declarations: [ChartsPacientePage]
})
export class ChartsPacientePageModule {}

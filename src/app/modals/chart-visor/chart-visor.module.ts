import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChartVisorPageRoutingModule } from './chart-visor-routing.module';

import { ChartVisorPage } from './chart-visor.page';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartVisorPageRoutingModule,
    NgxChartsModule
  ],
  declarations: [ChartVisorPage]
})
export class ChartVisorPageModule {}

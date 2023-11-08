import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertPeriodoFiltroPageRoutingModule } from './alert-periodo-filtro-routing.module';

import { AlertPeriodoFiltroPage } from './alert-periodo-filtro.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertPeriodoFiltroPageRoutingModule,
    TranslateModule.forChild() 
  ],
  declarations: [AlertPeriodoFiltroPage]
})
export class AlertPeriodoFiltroPageModule {}

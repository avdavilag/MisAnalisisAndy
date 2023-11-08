import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultadoOrdenPageRoutingModule } from './resultado-orden-routing.module';

import { ResultadoOrdenPage } from './resultado-orden.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultadoOrdenPageRoutingModule,
    TranslateModule.forChild() 
  ],
  declarations: [ResultadoOrdenPage]
})
export class ResultadoOrdenPageModule {}

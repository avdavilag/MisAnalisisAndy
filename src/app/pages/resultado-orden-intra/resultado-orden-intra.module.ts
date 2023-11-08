import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultadoOrdenIntraPageRoutingModule } from './resultado-orden-intra-routing.module';

import { ResultadoOrdenIntraPage } from './resultado-orden-intra.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultadoOrdenIntraPageRoutingModule,
    TranslateModule.forChild() 
  ],
  declarations: [ResultadoOrdenIntraPage]
})
export class ResultadoOrdenIntraPageModule {}

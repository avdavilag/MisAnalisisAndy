import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnvioBloquePageRoutingModule } from './envio-bloque-routing.module';

import { EnvioBloquePage } from './envio-bloque.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    EnvioBloquePageRoutingModule
  ],
  declarations: [EnvioBloquePage]
})
export class EnvioBloquePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnvioIessPageRoutingModule } from './envio-iess-routing.module';

import { EnvioIessPage } from './envio-iess.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnvioIessPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [EnvioIessPage]
})
export class EnvioIessPageModule {}

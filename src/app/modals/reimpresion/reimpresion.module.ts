import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReimpresionPageRoutingModule } from './reimpresion-routing.module';

import { ReimpresionPage } from './reimpresion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReimpresionPageRoutingModule
  ],
  declarations: [ReimpresionPage]
})
export class ReimpresionPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChequeoOrdenPageRoutingModule } from './chequeo-orden-routing.module';

import { ChequeoOrdenPage } from './chequeo-orden.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChequeoOrdenPageRoutingModule
  ],
  declarations: [ChequeoOrdenPage]
})
export class ChequeoOrdenPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MuestrasPageRoutingModule } from './muestras-routing.module';

import { MuestrasPage } from './muestras.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MuestrasPageRoutingModule
  ],
  declarations: [MuestrasPage]
})
export class MuestrasPageModule {}

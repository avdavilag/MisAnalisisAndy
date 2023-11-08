import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EvcalidadPageRoutingModule } from './evcalidad-routing.module';

import { EvcalidadPage } from './evcalidad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvcalidadPageRoutingModule
  ],
  declarations: [EvcalidadPage]
})
export class EvcalidadPageModule {}

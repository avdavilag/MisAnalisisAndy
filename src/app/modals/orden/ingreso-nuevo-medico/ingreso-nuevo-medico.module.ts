import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IngresoNuevoMedicoPageRoutingModule } from './ingreso-nuevo-medico-routing.module';

import { IngresoNuevoMedicoPage } from './ingreso-nuevo-medico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IngresoNuevoMedicoPageRoutingModule
  ],
  declarations: [IngresoNuevoMedicoPage]
})
export class IngresoNuevoMedicoPageModule {}

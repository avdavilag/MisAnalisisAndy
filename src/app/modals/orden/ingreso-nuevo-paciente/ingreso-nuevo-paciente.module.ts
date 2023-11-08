import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IngresoNuevoPacientePageRoutingModule } from './ingreso-nuevo-paciente-routing.module';

import { IngresoNuevoPacientePage } from './ingreso-nuevo-paciente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IngresoNuevoPacientePageRoutingModule
  ],
  declarations: [IngresoNuevoPacientePage]
})
export class IngresoNuevoPacientePageModule {}

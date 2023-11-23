import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusquedaPacientesPageRoutingModule } from './busqueda-pacientes-routing.module';

import { BusquedaPacientesPage } from './busqueda-pacientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusquedaPacientesPageRoutingModule
  ],
  declarations: [BusquedaPacientesPage]
})
export class BusquedaPacientesPageModule {}

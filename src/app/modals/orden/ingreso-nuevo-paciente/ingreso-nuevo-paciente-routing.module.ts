import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoNuevoPacientePage } from './ingreso-nuevo-paciente.page';

const routes: Routes = [
  {
    path: '',
    component: IngresoNuevoPacientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IngresoNuevoPacientePageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoNuevoMedicoPage } from './ingreso-nuevo-medico.page';

const routes: Routes = [
  {
    path: '',
    component: IngresoNuevoMedicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IngresoNuevoMedicoPageRoutingModule {}

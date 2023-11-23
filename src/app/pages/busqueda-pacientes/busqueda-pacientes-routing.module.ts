import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusquedaPacientesPage } from './busqueda-pacientes.page';

const routes: Routes = [
  {
    path: '',
    component: BusquedaPacientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusquedaPacientesPageRoutingModule {}

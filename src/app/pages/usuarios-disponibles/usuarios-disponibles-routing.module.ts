import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosDisponiblesPage } from './usuarios-disponibles.page';

const routes: Routes = [
  {
    path: '',
    component: UsuariosDisponiblesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosDisponiblesPageRoutingModule {}

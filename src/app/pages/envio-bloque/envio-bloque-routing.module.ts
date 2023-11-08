import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnvioBloquePage } from './envio-bloque.page';

const routes: Routes = [
  {
    path: '',
    component: EnvioBloquePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnvioBloquePageRoutingModule {}

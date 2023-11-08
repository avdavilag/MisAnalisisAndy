import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoOrdenCompletaPage } from './ingreso-orden-completa.page';

const routes: Routes = [
  {
    path: '',
    component: IngresoOrdenCompletaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IngresoOrdenCompletaPageRoutingModule {}

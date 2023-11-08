import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoOrdenPage } from './ingreso-orden.page';

const routes: Routes = [
  {
    path: '',
    component: IngresoOrdenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IngresoOrdenPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoFacturaPage } from './ingreso-factura.page';

const routes: Routes = [
  {
    path: '',
    component: IngresoFacturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IngresoFacturaPageRoutingModule {}

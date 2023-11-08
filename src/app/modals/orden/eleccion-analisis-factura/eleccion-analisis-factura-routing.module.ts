import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EleccionAnalisisFacturaPage } from './eleccion-analisis-factura.page';

const routes: Routes = [
  {
    path: '',
    component: EleccionAnalisisFacturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EleccionAnalisisFacturaPageRoutingModule {}

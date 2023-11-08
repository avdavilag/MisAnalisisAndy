import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultadoPedidoPage } from './resultado-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: ResultadoPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultadoPedidoPageRoutingModule {}

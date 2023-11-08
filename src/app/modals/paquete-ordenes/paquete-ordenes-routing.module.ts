import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaqueteOrdenesPage } from './paquete-ordenes.page';

const routes: Routes = [
  {
    path: '',
    component: PaqueteOrdenesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaqueteOrdenesPageRoutingModule {}

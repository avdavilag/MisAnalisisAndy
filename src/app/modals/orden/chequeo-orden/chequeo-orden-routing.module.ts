import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChequeoOrdenPage } from './chequeo-orden.page';

const routes: Routes = [
  {
    path: '',
    component: ChequeoOrdenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChequeoOrdenPageRoutingModule {}

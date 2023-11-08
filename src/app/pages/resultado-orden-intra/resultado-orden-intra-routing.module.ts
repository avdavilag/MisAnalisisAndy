import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultadoOrdenIntraPage } from './resultado-orden-intra.page';

const routes: Routes = [
  {
    path: '',
    component: ResultadoOrdenIntraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultadoOrdenIntraPageRoutingModule {}

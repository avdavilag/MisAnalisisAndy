import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultadoOrdenPage } from './resultado-orden.page';

const routes: Routes = [
  {
    path: '',
    component: ResultadoOrdenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultadoOrdenPageRoutingModule {}

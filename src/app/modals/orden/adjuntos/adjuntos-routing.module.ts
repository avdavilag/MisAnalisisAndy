import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdjuntosPage } from './adjuntos.page';

const routes: Routes = [
  {
    path: '',
    component: AdjuntosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdjuntosPageRoutingModule {}

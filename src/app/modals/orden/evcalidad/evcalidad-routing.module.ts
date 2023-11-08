import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvcalidadPage } from './evcalidad.page';

const routes: Routes = [
  {
    path: '',
    component: EvcalidadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvcalidadPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MuestrasPage } from './muestras.page';

const routes: Routes = [
  {
    path: '',
    component: MuestrasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MuestrasPageRoutingModule {}

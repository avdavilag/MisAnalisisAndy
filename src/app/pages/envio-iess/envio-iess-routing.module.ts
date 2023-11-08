import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnvioIessPage } from './envio-iess.page';

const routes: Routes = [
  {
    path: '',
    component: EnvioIessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnvioIessPageRoutingModule {}

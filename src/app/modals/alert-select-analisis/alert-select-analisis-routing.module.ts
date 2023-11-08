import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertSelectAnalisisPage } from './alert-select-analisis.page';

const routes: Routes = [
  {
    path: '',
    component: AlertSelectAnalisisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertSelectAnalisisPageRoutingModule {}

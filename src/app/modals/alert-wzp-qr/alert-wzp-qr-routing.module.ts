import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertWzpQrPage } from './alert-wzp-qr.page';

const routes: Routes = [
  {
    path: '',
    component: AlertWzpQrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertWzpQrPageRoutingModule {}

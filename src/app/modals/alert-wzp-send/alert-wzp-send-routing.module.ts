import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertWzpSendPage } from './alert-wzp-send.page';

const routes: Routes = [
  {
    path: '',
    component: AlertWzpSendPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertWzpSendPageRoutingModule {}

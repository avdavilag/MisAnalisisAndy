import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertLoginPage } from './alert-login.page';

const routes: Routes = [
  {
    path: '',
    component: AlertLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertLoginPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginIntranetPage } from './login-intranet.page';

const routes: Routes = [
  {
    path: '',
    component: LoginIntranetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginIntranetPageRoutingModule {}

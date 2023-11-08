import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PolicyLoginPage } from './policy-login.page';

const routes: Routes = [
  {
    path: '',
    component: PolicyLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PolicyLoginPageRoutingModule {}

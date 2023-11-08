import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverUsrPage } from './popover-usr.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverUsrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverUsrPageRoutingModule {}

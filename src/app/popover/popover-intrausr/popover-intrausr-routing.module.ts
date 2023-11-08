import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverIntrausrPage } from './popover-intrausr.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverIntrausrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverIntrausrPageRoutingModule {}

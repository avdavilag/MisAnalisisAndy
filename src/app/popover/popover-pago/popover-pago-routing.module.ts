import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverPagoPage } from './popover-pago.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverPagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverPagoPageRoutingModule {}

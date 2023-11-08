import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuordenPage } from './menuorden.page';

const routes: Routes = [
  {
    path: '',
    component: MenuordenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuordenPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReimpresionPage } from './reimpresion.page';

const routes: Routes = [
  {
    path: '',
    component: ReimpresionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReimpresionPageRoutingModule {}

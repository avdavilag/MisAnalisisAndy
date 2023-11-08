import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChartVisorPage } from './chart-visor.page';

const routes: Routes = [
  {
    path: '',
    component: ChartVisorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartVisorPageRoutingModule {}

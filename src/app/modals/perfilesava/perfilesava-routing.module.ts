import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilesavaPage } from './perfilesava.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilesavaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilesavaPageRoutingModule {}

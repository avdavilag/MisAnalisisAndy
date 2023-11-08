import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListTipoPage } from './list-tipo.page';

const routes: Routes = [
  {
    path: '',
    component: ListTipoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListTipoPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaOrdenWebPage } from './lista-orden-web.page';

const routes: Routes = [
  {
    path: '',
    component: ListaOrdenWebPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaOrdenWebPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaOrdenPage } from './lista-orden.page';

const routes: Routes = [
  {
    path: '',
    component: ListaOrdenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaOrdenPageRoutingModule {}

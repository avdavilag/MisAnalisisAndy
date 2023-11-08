import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GetAnalisisIndividualOrdenPage } from './get-analisis-individual-orden.page';

const routes: Routes = [
  {
    path: '',
    component: GetAnalisisIndividualOrdenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GetAnalisisIndividualOrdenPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearperfilPage } from './crearperfil.page';

const routes: Routes = [
  {
    path: '',
    component: CrearperfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearperfilPageRoutingModule {}

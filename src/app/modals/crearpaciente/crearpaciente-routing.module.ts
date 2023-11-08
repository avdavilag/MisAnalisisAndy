import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearpacientePage } from './crearpaciente.page';

const routes: Routes = [
  {
    path: '',
    component: CrearpacientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearpacientePageRoutingModule {}

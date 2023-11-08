import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchPacientePage } from './search-paciente.page';

const routes: Routes = [
  {
    path: '',
    component: SearchPacientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchPacientePageRoutingModule {}

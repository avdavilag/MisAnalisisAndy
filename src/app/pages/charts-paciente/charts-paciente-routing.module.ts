import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChartsPacientePage } from './charts-paciente.page';

const routes: Routes = [
  {
    path: '',
    component: ChartsPacientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartsPacientePageRoutingModule {}

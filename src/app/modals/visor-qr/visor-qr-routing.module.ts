import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisorQrPage } from './visor-qr.page';

const routes: Routes = [
  {
    path: '',
    component: VisorQrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisorQrPageRoutingModule {}

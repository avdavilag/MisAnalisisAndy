import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PdfOrdenwebPage } from './pdf-ordenweb.page';

const routes: Routes = [
  {
    path: '',
    component: PdfOrdenwebPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdfOrdenwebPageRoutingModule {}

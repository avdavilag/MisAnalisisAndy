import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectPdfPage } from './select-pdf.page';

const routes: Routes = [
  {
    path: '',
    component: SelectPdfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectPdfPageRoutingModule {}

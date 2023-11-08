import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PdfPreviewResultPage } from './pdf-preview-result.page';

const routes: Routes = [
  {
    path: '',
    component: PdfPreviewResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdfPreviewResultPageRoutingModule {}

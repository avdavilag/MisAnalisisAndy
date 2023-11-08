import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfPreviewResultPageRoutingModule } from './pdf-preview-result-routing.module';

import { PdfPreviewResultPage } from './pdf-preview-result.page';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfPreviewResultPageRoutingModule,
    PdfViewerModule,
  ],
  declarations: [PdfPreviewResultPage]
})
export class PdfPreviewResultPageModule {}

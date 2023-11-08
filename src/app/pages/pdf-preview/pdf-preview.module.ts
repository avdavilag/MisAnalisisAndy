import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfPreviewPageRoutingModule } from './pdf-preview-routing.module';

import { PdfPreviewPage } from './pdf-preview.page';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfPreviewPageRoutingModule,
    PdfViewerModule,
    TranslateModule.forChild() 
  ],
  declarations: [PdfPreviewPage]
})
export class PdfPreviewPageModule {}

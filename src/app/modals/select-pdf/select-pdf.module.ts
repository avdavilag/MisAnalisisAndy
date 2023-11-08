import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectPdfPageRoutingModule } from './select-pdf-routing.module';

import { SelectPdfPage } from './select-pdf.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectPdfPageRoutingModule,
    TranslateModule.forChild() 
  ],
  declarations: [SelectPdfPage]
})
export class SelectPdfPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfOrdenwebPageRoutingModule } from './pdf-ordenweb-routing.module';

import { PdfOrdenwebPage } from './pdf-ordenweb.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfOrdenwebPageRoutingModule
  ],
  declarations: [PdfOrdenwebPage]
})
export class PdfOrdenwebPageModule {}

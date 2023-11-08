import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisorQrPageRoutingModule } from './visor-qr-routing.module';

import { VisorQrPage } from './visor-qr.page';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisorQrPageRoutingModule,
    QRCodeModule
  ],
  declarations: [VisorQrPage]
})
export class VisorQrPageModule {}

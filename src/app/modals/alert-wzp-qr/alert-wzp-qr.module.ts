import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertWzpQrPageRoutingModule } from './alert-wzp-qr-routing.module';

import { AlertWzpQrPage } from './alert-wzp-qr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertWzpQrPageRoutingModule
  ],
  declarations: [AlertWzpQrPage]
})
export class AlertWzpQrPageModule {}

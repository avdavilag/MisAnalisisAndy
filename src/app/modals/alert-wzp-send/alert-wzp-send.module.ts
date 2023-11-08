import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertWzpSendPageRoutingModule } from './alert-wzp-send-routing.module';

import { AlertWzpSendPage } from './alert-wzp-send.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertWzpSendPageRoutingModule
  ],
  declarations: [AlertWzpSendPage]
})
export class AlertWzpSendPageModule {}

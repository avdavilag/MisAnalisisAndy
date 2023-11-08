import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertSbloqueSelectPageRoutingModule } from './alert-sbloque-select-routing.module';

import { AlertSbloqueSelectPage } from './alert-sbloque-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertSbloqueSelectPageRoutingModule
  ],
  declarations: [AlertSbloqueSelectPage]
})
export class AlertSbloqueSelectPageModule {}

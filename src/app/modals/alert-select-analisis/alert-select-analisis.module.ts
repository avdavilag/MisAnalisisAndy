import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertSelectAnalisisPageRoutingModule } from './alert-select-analisis-routing.module';

import { AlertSelectAnalisisPage } from './alert-select-analisis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertSelectAnalisisPageRoutingModule
  ],
  declarations: [AlertSelectAnalisisPage]
})
export class AlertSelectAnalisisPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdjuntosPageRoutingModule } from './adjuntos-routing.module';

import { AdjuntosPage } from './adjuntos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdjuntosPageRoutingModule
  ],
  declarations: [AdjuntosPage]
})
export class AdjuntosPageModule {}

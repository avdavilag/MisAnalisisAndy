import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaqueteOrdenesPageRoutingModule } from './paquete-ordenes-routing.module';

import { PaqueteOrdenesPage } from './paquete-ordenes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaqueteOrdenesPageRoutingModule
  ],
  declarations: [PaqueteOrdenesPage]
})
export class PaqueteOrdenesPageModule {}

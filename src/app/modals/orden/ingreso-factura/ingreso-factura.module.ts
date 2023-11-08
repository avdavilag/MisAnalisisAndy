import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IngresoFacturaPageRoutingModule } from './ingreso-factura-routing.module';

import { IngresoFacturaPage } from './ingreso-factura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IngresoFacturaPageRoutingModule
  ],
  declarations: [IngresoFacturaPage]
})
export class IngresoFacturaPageModule {}

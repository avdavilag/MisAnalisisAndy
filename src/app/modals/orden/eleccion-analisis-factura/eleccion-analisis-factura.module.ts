import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EleccionAnalisisFacturaPageRoutingModule } from './eleccion-analisis-factura-routing.module';

import { EleccionAnalisisFacturaPage } from './eleccion-analisis-factura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EleccionAnalisisFacturaPageRoutingModule
  ],
  declarations: [EleccionAnalisisFacturaPage]
})
export class EleccionAnalisisFacturaPageModule {}

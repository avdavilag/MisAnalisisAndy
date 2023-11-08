import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultadoPedidoPageRoutingModule } from './resultado-pedido-routing.module';

import { ResultadoPedidoPage } from './resultado-pedido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultadoPedidoPageRoutingModule
  ],
  declarations: [ResultadoPedidoPage]
})
export class ResultadoPedidoPageModule {}

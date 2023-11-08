import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IngresoPedidoPageRoutingModule } from './ingreso-pedido-routing.module';

import { IngresoPedidoPage } from './ingreso-pedido.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IngresoPedidoPageRoutingModule,
    TranslateModule.forChild(),
    ComponentsModule
    
  ],
  declarations: [IngresoPedidoPage]
})
export class IngresoPedidoPageModule {}

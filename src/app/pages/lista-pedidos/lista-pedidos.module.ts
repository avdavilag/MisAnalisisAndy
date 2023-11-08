import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaPedidosPageRoutingModule } from './lista-pedidos-routing.module';

import { ListaPedidosPage } from './lista-pedidos.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaPedidosPageRoutingModule,
    TranslateModule.forChild(),
    ComponentsModule 
  ],
  declarations: [ListaPedidosPage]
})
export class ListaPedidosPageModule {}

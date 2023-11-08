import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaOrdenWebPageRoutingModule } from './lista-orden-web-routing.module';

import { ListaOrdenWebPage } from './lista-orden-web.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaOrdenWebPageRoutingModule
  ],
  declarations: [ListaOrdenWebPage]
})
export class ListaOrdenWebPageModule {}

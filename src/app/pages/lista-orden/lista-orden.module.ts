import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaOrdenPageRoutingModule } from './lista-orden-routing.module';

import { ListaOrdenPage } from './lista-orden.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaOrdenPageRoutingModule,
    TranslateModule.forChild(),
    ComponentsModule
    
  ],
  declarations: [ListaOrdenPage],
})
export class ListaOrdenPageModule {}

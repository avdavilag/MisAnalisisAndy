import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListTipoPageRoutingModule } from './list-tipo-routing.module';

import { ListTipoPage } from './list-tipo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListTipoPageRoutingModule
  ],
  declarations: [ListTipoPage]
})
export class ListTipoPageModule {}

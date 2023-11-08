import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearperfilPageRoutingModule } from './crearperfil-routing.module';

import { CrearperfilPage } from './crearperfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearperfilPageRoutingModule
  ],
  declarations: [CrearperfilPage]
})
export class CrearperfilPageModule {}

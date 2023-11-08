import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambioclavePageRoutingModule } from './cambioclave-routing.module';

import { CambioclavePage } from './cambioclave.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambioclavePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CambioclavePage]
})
export class CambioclavePageModule {}

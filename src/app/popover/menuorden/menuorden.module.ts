import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuordenPageRoutingModule } from './menuorden-routing.module';

import { MenuordenPage } from './menuorden.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuordenPageRoutingModule
  ],
  declarations: [MenuordenPage]
})
export class MenuordenPageModule {}

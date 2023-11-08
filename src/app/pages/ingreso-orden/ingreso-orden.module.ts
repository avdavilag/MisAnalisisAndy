import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IngresoOrdenPageRoutingModule } from './ingreso-orden-routing.module';

import { IngresoOrdenPage } from './ingreso-orden.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IngresoOrdenPageRoutingModule,
    TranslateModule
  ],
  declarations: [IngresoOrdenPage]
})
export class IngresoOrdenPageModule {}

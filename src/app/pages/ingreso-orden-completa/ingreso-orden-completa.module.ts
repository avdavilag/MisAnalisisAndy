import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IngresoOrdenCompletaPageRoutingModule } from './ingreso-orden-completa-routing.module';

import { IngresoOrdenCompletaPage } from './ingreso-orden-completa.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IngresoOrdenCompletaPageRoutingModule,
    TranslateModule
  ],
  declarations: [IngresoOrdenCompletaPage]
})
export class IngresoOrdenCompletaPageModule {}

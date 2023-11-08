import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GetAnalisisIndividualOrdenPageRoutingModule } from './get-analisis-individual-orden-routing.module';

import { GetAnalisisIndividualOrdenPage } from './get-analisis-individual-orden.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GetAnalisisIndividualOrdenPageRoutingModule
  ],
  declarations: [GetAnalisisIndividualOrdenPage]
})
export class GetAnalisisIndividualOrdenPageModule {}

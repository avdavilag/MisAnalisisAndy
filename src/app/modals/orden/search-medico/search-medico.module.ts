import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchMedicoPageRoutingModule } from './search-medico-routing.module';

import { SearchMedicoPage } from './search-medico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchMedicoPageRoutingModule
  ],
  declarations: [SearchMedicoPage]
})
export class SearchMedicoPageModule {}

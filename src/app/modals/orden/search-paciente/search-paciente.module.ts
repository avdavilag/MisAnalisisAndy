import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPacientePageRoutingModule } from './search-paciente-routing.module';

import { SearchPacientePage } from './search-paciente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPacientePageRoutingModule
  ],
  declarations: [SearchPacientePage]
})
export class SearchPacientePageModule {}

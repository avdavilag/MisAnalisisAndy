import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosDisponiblesPageRoutingModule } from './usuarios-disponibles-routing.module';

import { UsuariosDisponiblesPage } from './usuarios-disponibles.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosDisponiblesPageRoutingModule,
    TranslateModule.forChild() 
  ],
  declarations: [UsuariosDisponiblesPage]
})
export class UsuariosDisponiblesPageModule {}

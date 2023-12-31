import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListunidadPageRoutingModule } from './listunidad-routing.module';

import { ListunidadPage } from './listunidad.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListunidadPageRoutingModule,
    PipesModule
  ],
  declarations: [ListunidadPage]
})
export class ListunidadPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilesavaPageRoutingModule } from './perfilesava-routing.module';

import { PerfilesavaPage } from './perfilesava.page';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilesavaPageRoutingModule,
    TranslateModule.forChild(),
    PipesModule
  ],
  declarations: [PerfilesavaPage]
})
export class PerfilesavaPageModule {}

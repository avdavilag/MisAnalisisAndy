import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeMedicoPageRoutingModule } from './home-medico-routing.module';

import { HomeMedicoPage } from './home-medico.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeMedicoPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [HomeMedicoPage]
})
export class HomeMedicoPageModule {}

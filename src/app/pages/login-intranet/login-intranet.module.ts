import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginIntranetPageRoutingModule } from './login-intranet-routing.module';

import { LoginIntranetPage } from './login-intranet.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, //PONER ESTE PARA LOS FORMS
    IonicModule,
    TranslateModule,
    LoginIntranetPageRoutingModule,
    ComponentsModule
  ],
  declarations: [LoginIntranetPage]
})
export class LoginIntranetPageModule {}

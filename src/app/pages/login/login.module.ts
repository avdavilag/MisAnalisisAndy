import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, //PONER ESTE PARA LOS FORMS
    IonicModule,
    LoginPageRoutingModule,
    TranslateModule,
    ComponentsModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}

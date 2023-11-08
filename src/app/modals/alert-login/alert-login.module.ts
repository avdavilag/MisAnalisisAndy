import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertLoginPageRoutingModule } from './alert-login-routing.module';

import { AlertLoginPage } from './alert-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertLoginPageRoutingModule
  ],
  declarations: [AlertLoginPage]
})
export class AlertLoginPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PolicyLoginPageRoutingModule } from './policy-login-routing.module';

import { PolicyLoginPage } from './policy-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PolicyLoginPageRoutingModule
  ],
  declarations: [PolicyLoginPage]
})
export class PolicyLoginPageModule {}

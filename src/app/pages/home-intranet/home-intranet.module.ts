import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeIntranetPageRoutingModule } from './home-intranet-routing.module';

import { HomeIntranetPage } from './home-intranet.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeIntranetPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [HomeIntranetPage]
})
export class HomeIntranetPageModule {}

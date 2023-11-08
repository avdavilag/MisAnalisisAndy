import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverOrdenPageRoutingModule } from './popover-orden-routing.module';

import { PopoverOrdenPage } from './popover-orden.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverOrdenPageRoutingModule,
    TranslateModule.forChild() 
  ],
  declarations: [PopoverOrdenPage]
})
export class PopoverOrdenPageModule {}

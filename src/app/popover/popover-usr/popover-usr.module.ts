import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverUsrPageRoutingModule } from './popover-usr-routing.module';

import { PopoverUsrPage } from './popover-usr.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverUsrPageRoutingModule,
    TranslateModule.forChild() 
  ],
  declarations: [PopoverUsrPage]
})
export class PopoverUsrPageModule {}

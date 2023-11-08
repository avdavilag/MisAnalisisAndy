import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverIntrausrPageRoutingModule } from './popover-intrausr-routing.module';

import { PopoverIntrausrPage } from './popover-intrausr.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverIntrausrPageRoutingModule,
    TranslateModule.forChild() 
  ],
  declarations: [PopoverIntrausrPage]
})
export class PopoverIntrausrPageModule {}

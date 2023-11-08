import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverPagoPageRoutingModule } from './popover-pago-routing.module';

import { PopoverPagoPage } from './popover-pago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverPagoPageRoutingModule
  ],
  declarations: [PopoverPagoPage]
})
export class PopoverPagoPageModule {}

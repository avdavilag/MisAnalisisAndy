import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleOrdenPageRoutingModule } from './detalle-orden-routing.module';

import { DetalleOrdenPage } from './detalle-orden.page';
import { ResizeColumnDirective2 } from '../../utils/resize-column.directive';
import { TranslateModule } from '@ngx-translate/core';

import { txtBreakLine} from './txtBreakLinePipe'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleOrdenPageRoutingModule,
    TranslateModule.forChild() ,
    
  ],
  declarations: [DetalleOrdenPage,ResizeColumnDirective2,txtBreakLine]
})
export class DetalleOrdenPageModule {}

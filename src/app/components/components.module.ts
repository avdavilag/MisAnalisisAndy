import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PiePaginaComponent } from './pie-pagina/pie-pagina.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [PiePaginaComponent],
  exports:[PiePaginaComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ComponentsModule { }

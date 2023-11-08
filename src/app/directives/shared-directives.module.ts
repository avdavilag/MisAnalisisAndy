import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppearHeaderDirective } from './appear-header.directive';
import { AppearTitleAcordionDirective } from './appear-title-acordion.directive';
import { ResizeColumnDirective } from './resize-column.directive';



@NgModule({
  declarations: [
    AppearHeaderDirective,
    AppearTitleAcordionDirective,
    ResizeColumnDirective
  ],
  imports: [
    CommonModule
  ],
  exports:[
    AppearHeaderDirective,
    AppearTitleAcordionDirective,
    ResizeColumnDirective
  ]
})
export class SharedDirectivesModule { }

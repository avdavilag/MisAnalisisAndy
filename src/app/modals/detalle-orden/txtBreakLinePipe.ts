import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'txtBreakLine'})
export class txtBreakLine implements PipeTransform {
  transform(value: String): any {  
    var str=JSON.stringify(value);
    str=str.replace(/"/gm, "")
    str=str.replace(/(\\r\\n|\\r)/gm, "\n")
          
   return str;

  } 
}